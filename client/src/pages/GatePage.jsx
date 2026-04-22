import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChallenge, postVerify } from "../api.js";

const SK = "st_challenge";

function saveChallenge(id, code) {
  try { sessionStorage.setItem(SK, JSON.stringify({ id, code })); } catch {}
}
function loadChallenge() {
  try {
    const d = JSON.parse(sessionStorage.getItem(SK));
    if (d?.id && d?.code) return d;
  } catch {}
  return null;
}
function clearSavedChallenge() {
  try { sessionStorage.removeItem(SK); } catch {}
}

export default function GatePage() {
  const nav = useNavigate();
  const [challengeId, setChallengeId] = useState(null);
  const [challengeCode, setChallengeCode] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const saved = loadChallenge();
    if (saved) {
      setChallengeId(saved.id);
      setChallengeCode(saved.code);
    }
  }, []);

  const refreshChallenge = useCallback(async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await getChallenge();
      setChallengeId(data.challengeId);
      setChallengeCode(data.challengeCode);
      saveChallenge(data.challengeId, data.challengeCode);
      setPasscode("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const verify = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await postVerify({
        challengeId,
        passcode: passcode.replace(/\s/g, ""),
      });
      clearSavedChallenge();
      nav("/name");
    } catch (e) {
      if (/unknown|expired challenge/i.test(e.message)) {
        try {
          const fresh = await getChallenge();
          setChallengeId(fresh.challengeId);
          setChallengeCode(fresh.challengeCode);
          saveChallenge(fresh.challengeId, fresh.challengeCode);
          setPasscode("");
        } catch {}
        setErr(
          "Challenge expired — a new one has been generated above. " +
          "Send the new challenge code to your administrator for a fresh passcode."
        );
      } else {
        setErr(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-inter font-feature-default antialiased max-w-[560px] mx-auto px-5 pt-10 pb-16">
      <header className="mb-8">
        <h1 className="text-[1.75rem] font-bold tracking-tight mb-3">MERN self-test</h1>
        <p className="text-muted text-[0.95rem]">
          Send the challenge code to your administrator. They generate a passcode in
          their desktop app; that passcode encodes this challenge and the database URL. Paste the full
          passcode below. The MongoDB URL is not stored in this web project.
        </p>
        <p className="text-muted text-[0.95rem] mt-3">
          Use the challenge code from <strong className="text-text font-medium">this</strong> browser
          on <strong className="text-text font-medium">this</strong> running app: each open gate session
          has its own code, and the passcode must be minted for that exact string. A passcode made for
          someone else’s screen or another machine’s challenge will not work here.
        </p>
      </header>

      <section className="bg-surface border border-border rounded-xl p-5 mb-5">
        <h2 className="text-base font-semibold mb-4">Step 1 — Send to admin</h2>
        {!challengeCode ? (
          <button
            type="button"
            className="cursor-pointer rounded-lg text-[0.9rem] font-semibold px-4 py-2.5 border-none bg-gradient-to-br from-accent to-[#5588dd] text-[#0a0e14] self-start disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            onClick={refreshChallenge}
            disabled={loading}
          >
            Show challenge
          </button>
        ) : (
          <>
            <p className="text-sm text-muted mb-2">
              Challenge code (put this into the desktop app for a new passcode; must match exactly what
              is embedded in the token):
            </p>
            <pre className="mb-4 p-4 bg-bg border border-border rounded-lg font-mono text-xs break-all whitespace-pre-wrap text-accent" tabIndex={0}>
              {challengeCode}
            </pre>
            <p className="text-[0.8rem] text-muted leading-snug mb-4">
              Internal session id (only needed for this browser — included automatically when you
              submit): <code className="font-mono text-[0.78rem] break-all">{challengeId}</code>
            </p>
            <button
              type="button"
              className="cursor-pointer rounded-lg text-[0.9rem] font-semibold px-4 py-2.5 bg-transparent text-muted border border-border hover:text-text hover:border-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={refreshChallenge}
              disabled={loading}
            >
              New challenge
            </button>
          </>
        )}
      </section>

      <section className="bg-surface border border-border rounded-xl p-5 mb-5">
        <h2 className="text-base font-semibold mb-4">Step 2 — Paste passcode from desktop app</h2>
        <form onSubmit={verify} className="flex flex-col gap-2.5">
          <label className="text-sm text-muted" htmlFor="passcode">
            Passcode (encrypted payload)
          </label>
          <textarea
            id="passcode"
            className="w-full p-3 rounded-lg border border-border bg-bg text-text text-[0.8rem] font-mono leading-snug resize-y min-h-[120px] focus:outline-2 focus:outline-accent-dim focus:outline-offset-2"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Paste the full passcode from your administrator"
            rows={5}
            required
            disabled={!challengeCode}
            spellCheck={false}
          />
          {err && <p className="text-sm text-error">{err}</p>}
          <button
            type="submit"
            className="cursor-pointer rounded-lg text-[0.9rem] font-semibold px-4 py-2.5 border-none bg-gradient-to-br from-accent to-[#5588dd] text-[#0a0e14] self-start disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            disabled={loading || !challengeCode}
          >
            {loading ? "Verifying…" : "Continue"}
          </button>
        </form>
      </section>
    </div>
  );
}
