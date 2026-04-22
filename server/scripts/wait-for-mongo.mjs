import "../src/load-env.js";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set (expected from .env.handoff or .env)");
  process.exit(1);
}

const deadline = Date.now() + 90_000;
process.stdout.write("Waiting for MongoDB");

while (Date.now() < deadline) {
  try {
    await mongoose.connect(uri);
    await mongoose.disconnect();
    console.log("\nMongoDB is reachable.");
    process.exit(0);
  } catch {
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 1000));
  }
}

console.error("\nTimed out waiting for MongoDB. Start Docker (docker compose up -d) and retry.");
process.exit(1);
