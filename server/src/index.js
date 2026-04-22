import "./load-env.js";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import crypto from "crypto";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import { decryptUnlockPayload, UnlockDecryptError } from "./unlock-crypto.js";
import { Problem, problemPublicProjection } from "./models/Problem.js";
import { Submission } from "./models/Submission.js";
import { Participant } from "./models/Participant.js";

const app = express();
const httpServer = http.createServer(app);
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const UNLOCK_KEY = process.env.UNLOCK_KEY || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const MONGODB_URI = process.env.MONGODB_URI || "";
const SESSION_COOKIE = "st_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 8;
const CHALLENGE_TTL_MS = 1000 * 60 * 60 * 2;

const io = new SocketIOServer(httpServer, {
  cors: { origin: CLIENT_ORIGIN, credentials: true },
});

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "256kb" }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const challenges = new Map();

function signSession(payload) {
  if (!SESSION_SECRET) throw new Error("Missing SESSION_SECRET");
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifySessionToken(raw) {
  if (!raw || typeof raw !== "string") return null;
  const i = raw.lastIndexOf(".");
  if (i === -1) return null;
  const body = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function readSession(req) {
  return verifySessionToken(req.cookies?.[SESSION_COOKIE]);
}

function requireSession(req, res, next) {
  const s = readSession(req);
  if (!s?.verifiedAt) {
    return res.status(401).json({ error: "Authentication required" });
  }
  req.sessionData = s;
  next();
}

function getSessionId(req) {
  const s = readSession(req);
  if (!s) return null;
  return String(s.verifiedAt);
}

function pruneChallenges() {
  const now = Date.now();
  for (const [k, v] of challenges) {
    if (now - v.createdAt > CHALLENGE_TTL_MS) challenges.delete(k);
  }
}

async function connectFromUri(uri) {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);
}

function answersMatch(type, submitted, correct) {
  const s = String(submitted).trim();
  const c = String(correct).trim();
  if (type === "shortText") {
    return s.toLowerCase() === c.toLowerCase();
  }
  return s === c;
}

async function buildAllProgress() {
  const participants = await Participant.find()
    .select("name solvedProblems solvedByLevel")
    .lean();
  return participants.map((p) => ({
    id: p._id,
    name: p.name,
    solvedByLevel: p.solvedByLevel || {},
    totalSolved: (p.solvedProblems || []).length,
  }));
}

async function emitProgress() {
  const all = await buildAllProgress();
  io.emit("progressUpdate", all);
}

// ── Socket.io authentication ──────────────────────────────────────────────

io.use((socket, next) => {
  try {
    const raw = socket.handshake.headers.cookie || "";
    const cookies = cookie.parse(raw);
    const session = verifySessionToken(cookies[SESSION_COOKIE]);
    socket.sessionData = session?.verifiedAt ? session : null;
  } catch { /* no session */ }
  next();
});

io.on("connection", (socket) => {
  socket.on("requestProgress", async () => {
    try {
      const all = await buildAllProgress();
      socket.emit("progressUpdate", all);
    } catch { /* ignore */ }
  });
});

// ── Routes ────────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

function decryptErrorMessage(err) {
  if (err instanceof UnlockDecryptError) {
    switch (err.kind) {
      case "expired":
        return "Passcode expired (time limit inside the token has passed; ask for a new passcode)";
      case "malformed":
        return "Malformed passcode (truncated, wrong encoding, or incomplete paste)";
      case "invalidPayload":
        return "Invalid passcode payload (token decrypted but is missing challenge or database URI)";
      case "authFailed":
        return "Invalid passcode (UNLOCK_KEY on this server does not match the desktop app, or the paste is corrupted)";
      default:
        return "Invalid passcode";
    }
  }
  return null;
}

app.get("/api/auth/challenge", authLimiter, (req, res) => {
  pruneChallenges();
  const challengeId = crypto.randomUUID();
  const challengeCode = crypto.randomBytes(24).toString("base64url");
  challenges.set(challengeId, { challengeCode, createdAt: Date.now() });
  res.json({ challengeId, challengeCode });
});

app.post("/api/auth/verify", authLimiter, async (req, res) => {
  if (!UNLOCK_KEY) {
    return res.status(500).json({ error: "Server missing UNLOCK_KEY" });
  }
  const { challengeId, passcode } = req.body || {};
  if (!challengeId || passcode == null || String(passcode).trim() === "") {
    return res.status(400).json({ error: "challengeId and passcode required" });
  }
  const stored = challenges.get(challengeId);
  if (!stored) {
    return res.status(400).json({ error: "Unknown or expired challenge" });
  }
  if (Date.now() - stored.createdAt > CHALLENGE_TTL_MS) {
    challenges.delete(challengeId);
    return res.status(400).json({ error: "Challenge expired" });
  }
  let data;
  try {
    data = decryptUnlockPayload(UNLOCK_KEY, passcode);
  } catch (err) {
    const specific = decryptErrorMessage(err);
    if (specific) {
      return res.status(400).json({ error: specific });
    }
    if (String(err?.message || "").includes("UNLOCK_KEY must be exactly")) {
      return res.status(500).json({ error: "Server misconfiguration: UNLOCK_KEY must be 64 hexadecimal characters" });
    }
    return res.status(400).json({ error: "Invalid passcode" });
  }
  if (data.challengeCode !== stored.challengeCode) {
    return res.status(400).json({ error: "Passcode does not match this challenge" });
  }
  try {
    await connectFromUri(data.mongoUri);
  } catch {
    return res.status(502).json({ error: "Database connection failed" });
  }
  challenges.delete(challengeId);
  const sessionToken = signSession({ verifiedAt: Date.now() });
  res.cookie(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_MS,
  });
  res.json({ ok: true });
});

app.post("/api/session/name", requireSession, async (req, res) => {
  const sessionId = getSessionId(req);
  if (!sessionId) return res.status(401).json({ error: "Invalid session" });
  const { name } = req.body || {};
  if (!name || String(name).trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }
  const participant = await Participant.findOneAndUpdate(
    { sessionId },
    { $set: { name: String(name).trim() } },
    { upsert: true, new: true }
  );
  res.json({ participantId: participant._id, name: participant.name });
});

app.get("/api/progress", requireSession, async (req, res) => {
  const sessionId = getSessionId(req);
  const participant = sessionId ? await Participant.findOne({ sessionId }).lean() : null;
  const levels = [1, 2, 3];
  const counts = await Promise.all(levels.map((l) => Problem.countDocuments({ level: l })));
  const totalProblems = counts.reduce((a, b) => a + b, 0);
  const problemCountByLevel = {};
  levels.forEach((l, i) => { problemCountByLevel[l] = counts[i]; });
  if (!participant) {
    return res.json({
      name: null,
      solvedByLevel: { 1: 0, 2: 0, 3: 0 },
      totalSolved: 0,
      totalProblems,
      problemCountByLevel,
      solvedProblemIds: [],
    });
  }
  res.json({
    name: participant.name,
    solvedByLevel: participant.solvedByLevel || { 1: 0, 2: 0, 3: 0 },
    totalSolved: (participant.solvedProblems || []).length,
    totalProblems,
    problemCountByLevel,
    solvedProblemIds: (participant.solvedProblems || []).map(String),
  });
});

app.get("/api/admin/progress", requireSession, async (req, res) => {
  const levels = [1, 2, 3];
  const counts = await Promise.all(levels.map((l) => Problem.countDocuments({ level: l })));
  const totalProblems = counts.reduce((a, b) => a + b, 0);
  const problemCountByLevel = {};
  levels.forEach((l, i) => { problemCountByLevel[l] = counts[i]; });
  const all = await buildAllProgress();
  res.json({ participants: all, totalProblems, problemCountByLevel });
});

app.get("/api/levels", requireSession, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database unavailable" });
  }
  const levels = [1, 2, 3];
  const counts = await Promise.all(levels.map((level) => Problem.countDocuments({ level })));
  res.json({
    levels: levels.map((id, idx) => ({ id, problemCount: counts[idx] })),
  });
});

app.get("/api/problems", requireSession, async (req, res) => {
  const level = Number(req.query.level);
  if (![1, 2, 3].includes(level)) {
    return res.status(400).json({ error: "Invalid or missing level (1–3)" });
  }
  const list = await Problem.find({ level })
    .sort({ order: 1 })
    .select(problemPublicProjection)
    .lean();
  res.json(list);
});

app.get("/api/problems/:id", requireSession, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const p = await Problem.findById(req.params.id).select(problemPublicProjection).lean();
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

app.post("/api/submissions", requireSession, async (req, res) => {
  const { problemId, answer } = req.body || {};
  if (!problemId || answer == null) {
    return res.status(400).json({ error: "problemId and answer required" });
  }
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    return res.status(400).json({ error: "Invalid problemId" });
  }
  const problem = await Problem.findById(problemId);
  if (!problem) return res.status(404).json({ error: "Problem not found" });
  const normalized = String(answer).trim();
  const passed = answersMatch(problem.type, answer, problem.correctAnswer);
  const sub = await Submission.create({
    problemId,
    anonymousId: getSessionId(req) || "",
    answer: normalized,
    passed,
  });

  if (passed) {
    const sessionId = getSessionId(req);
    if (sessionId) {
      const participant = await Participant.findOne({ sessionId });
      if (participant) {
        const pid = problem._id.toString();
        const alreadySolved = participant.solvedProblems.some((s) => s.toString() === pid);
        if (!alreadySolved) {
          participant.solvedProblems.push(problem._id);
          const lvl = String(problem.level);
          participant.solvedByLevel.set(lvl, (participant.solvedByLevel.get(lvl) || 0) + 1);
          await participant.save();
        }
        emitProgress().catch(() => {});
      }
    }
  }

  res.json({ correct: passed, passed, submissionId: sub._id });
});

async function start() {
  if (!UNLOCK_KEY) {
    console.error("UNLOCK_KEY is required (64 hex chars, shared with your desktop unlock app)");
    process.exit(1);
  }
  if (!SESSION_SECRET) {
    console.error("SESSION_SECRET is required (random string for signing session cookies)");
    process.exit(1);
  }
  if (MONGODB_URI) {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected using MONGODB_URI from environment");
  } else {
    console.log("No MONGODB_URI at startup — database URL will come from decrypted passcode after unlock");
  }
  httpServer.listen(PORT, () => {
    console.log(`API http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
