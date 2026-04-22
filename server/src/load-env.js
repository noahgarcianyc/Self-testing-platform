import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Handoff defaults (committed). Optional `.env` in server/ overrides any variable.
dotenv.config({ path: resolve(__dirname, "../.env.handoff") });
dotenv.config({ path: resolve(__dirname, "../.env") });
