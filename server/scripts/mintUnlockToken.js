/**
 * REFERENCE implementation — same crypto your desktop app must implement.
 *
 * The user sends you the challenge **code** (random string from the web UI). Your desktop app
 * encrypts JSON containing that exact code plus the MongoDB URI. The web server decrypts with
 * the same UNLOCK_KEY and connects to that database.
 *
 * ---------------------------------------------------------------------------
 * DESKTOP APP WIRE FORMAT (implement identically in your stack)
 * ---------------------------------------------------------------------------
 * Key: UNLOCK_KEY = 32 bytes = 64 hex characters (same value on server .env and in desktop app).
 *
 * Algorithm: AES-256-GCM.
 * IV: 12 random bytes per encryption.
 * AAD: none.
 * Plaintext: UTF-8 JSON object, minified or not, with keys:
 *   - "challengeCode" (string, required): exact challenge code string from the user (must match
 *     character-for-character what the API returned as challengeCode).
 *   - "mongoUri" (string, required): full MongoDB connection string.
 *   - "exp" (number, optional): Unix timestamp in milliseconds; after this time the token is invalid.
 *
 * Ciphertext layout before base64url encoding:
 *   [ 12 bytes IV ][ 16 bytes GCM auth tag ][ ciphertext... ]
 *
 * Output: base64url (RFC 4648 URL-safe alphabet, no padding) of the concatenated buffer above.
 * When decoding, strip whitespace from the pasted token before base64url decode.
 *
 * Node reference:
 *   const cipher = crypto.createCipheriv('aes-256-gcm', key32Bytes, iv12);
 *   const enc = Buffer.concat([cipher.update(plainUtf8), cipher.final()]);
 *   const tag = cipher.getAuthTag();
 *   token = base64url(iv + tag + enc);
 *
 * ---------------------------------------------------------------------------
 * CLI usage (optional testing; your desktop app replaces this)
 * ---------------------------------------------------------------------------
 * Reads UNLOCK_KEY and MONGODB_URI from (in order, each overriding the previous):
 *   config/embedded.config.handoff.json  →  desktop/*.json (if present)  →  process.env
 * Same merge as your desktop app should use so the passcode embeds the same mongoUri.
 *
 *   node scripts/mintUnlockToken.js --challengeCode "<paste from user>"
 *
 * Optional: --hours 24  (sets exp on payload)
 */
import "../src/load-env.js";
import { encryptUnlockPayload } from "../src/unlock-crypto.js";
import { readDesktopPasscodeConfig } from "./read-desktop-passcode-config.js";

const desktop = readDesktopPasscodeConfig();
const unlockKey = desktop.UNLOCK_KEY || process.env.UNLOCK_KEY;
const mongoUri = desktop.MONGODB_URI || process.env.MONGODB_URI;

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : null;
}

const challengeCode = arg("--challengeCode");
const hours = Number(arg("--hours") || "48");

if (!challengeCode) {
  console.error('Usage: node scripts/mintUnlockToken.js --challengeCode "<string from user>" [--hours 48]');
  process.exit(1);
}
if (!unlockKey || !mongoUri) {
  console.error(
    "Missing UNLOCK_KEY or MONGODB_URI. See config/embedded.config.handoff.json, " +
      "optional desktop/embedded.config.json (docs/desktop-unlock.md), or server/.env."
  );
  process.exit(1);
}

const exp = Date.now() + hours * 60 * 60 * 1000;
const payload = { challengeCode, mongoUri, exp };
const token = encryptUnlockPayload(unlockKey, payload);

console.log("\n--- Passcode for user (paste entire line) ---\n");
console.log(token);
console.log("\n---------------------------------------------\n");
