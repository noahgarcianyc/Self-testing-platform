import { readFileSync, existsSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

/** Project root (repo root), from server/scripts/ */
function repoRoot() {
  return resolve(dirname(fileURLToPath(import.meta.url)), "../..");
}

/**
 * Values your desktop app should use when minting (same merge order as mintUnlockToken).
 * 1) config/embedded.config.handoff.json (tracked — same keys as server/.env.handoff)
 * 2) desktop/embedded.config.handoff.json (optional local; desktop/ is gitignored on GitHub)
 * 3) desktop/embedded.config.json (optional local — e.g. Atlas MONGODB_URI)
 *
 * mintUnlockToken uses (merged JSON field) || process.env.
 */
export function readDesktopPasscodeConfig() {
  const root = repoRoot();
  const paths = [
    resolve(root, "config/embedded.config.handoff.json"),
    resolve(root, "desktop/embedded.config.handoff.json"),
    resolve(root, "desktop/embedded.config.json"),
  ];
  let j = {};
  for (const p of paths) {
    if (!existsSync(p)) continue;
    try {
      Object.assign(j, JSON.parse(readFileSync(p, "utf8")));
    } catch (e) {
      console.warn(`Skipping invalid JSON: ${p} (${e.message})`);
    }
  }
  return j;
}
