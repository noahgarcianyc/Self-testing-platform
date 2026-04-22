# Desktop unlock app (admin)

The **`desktop/`** folder is **gitignored** so you can keep your local Electron (or other) unlock app there and **not** push it to GitHub.

## Defaults that *are* on GitHub

Same `UNLOCK_KEY` and `MONGODB_URI` as [`server/.env.handoff`](../server/.env.handoff) live in **[`config/embedded.config.handoff.json`](../config/embedded.config.handoff.json)** (tracked).

Your desktop app should build the encrypted passcode from those two values plus the gate **`challengeCode`** (see [`server/scripts/mintUnlockToken.js`](../server/scripts/mintUnlockToken.js)).

## Optional local overrides (not pushed)

- Copy **`config/embedded.config.handoff.json`** → **`desktop/embedded.config.json`** and set **`MONGODB_URI`** to Atlas, **or** create only `desktop/embedded.config.json` with overrides — `mintUnlockToken.js` merges `config/` then `desktop/` JSON files.

## Passcode includes `mongoUri`

**Yes.** The token encrypts JSON with `challengeCode`, `mongoUri`, and optional `exp`. After verify, the server connects with **`mongoUri` from the decrypted passcode**.

Reference: [`server/scripts/mintUnlockToken.js`](../server/scripts/mintUnlockToken.js).
