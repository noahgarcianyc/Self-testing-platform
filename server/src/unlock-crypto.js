/**
 * Keep wire format in sync with desktop/lib/unlock-crypto.js
 */
import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const AUTH_TAG_LEN = 16;

/** Thrown from decryptUnlockPayload so the API can return specific messages. */
export class UnlockDecryptError extends Error {
  constructor(kind) {
    super(kind);
    this.name = "UnlockDecryptError";
    this.kind = kind;
  }
}

function keyFromHex(unlockKeyHex) {
  if (!unlockKeyHex || unlockKeyHex.length !== 64 || !/^[0-9a-fA-F]+$/.test(unlockKeyHex)) {
    throw new Error("UNLOCK_KEY must be exactly 64 hexadecimal characters (32 bytes)");
  }
  return Buffer.from(unlockKeyHex, "hex");
}

/**
 * Plaintext JSON (UTF-8) must be:
 *   { "challengeCode": "<exact string from user UI>", "mongoUri": "<connection string>", "exp"?: <unix ms> }
 * Wire format: base64url( IV(12) || authTag(16) || ciphertext )
 */
export function encryptUnlockPayload(unlockKeyHex, payload) {
  const key = keyFromHex(unlockKeyHex);
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const plain = Buffer.from(JSON.stringify(payload), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plain), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString("base64url");
}

export function decryptUnlockPayload(unlockKeyHex, token) {
  const key = keyFromHex(unlockKeyHex);
  const compact = String(token).replace(/\s/g, "");
  const raw = Buffer.from(compact, "base64url");
  if (raw.length < IV_LEN + AUTH_TAG_LEN + 1) {
    throw new UnlockDecryptError("malformed");
  }
  const iv = raw.subarray(0, IV_LEN);
  const authTag = raw.subarray(IV_LEN, IV_LEN + AUTH_TAG_LEN);
  const ciphertext = raw.subarray(IV_LEN + AUTH_TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  let plain;
  try {
    plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  } catch {
    throw new UnlockDecryptError("authFailed");
  }
  let data;
  try {
    data = JSON.parse(plain.toString("utf8"));
  } catch {
    throw new UnlockDecryptError("authFailed");
  }
  if (!data.challengeCode || !data.mongoUri) {
    throw new UnlockDecryptError("invalidPayload");
  }
  if (data.exp != null && Date.now() > Number(data.exp)) {
    throw new UnlockDecryptError("expired");
  }
  return data;
}
