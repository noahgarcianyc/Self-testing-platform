# Quick start (no manual `.env` editing)

Use this flow when you send the project to candidates or run it yourself locally.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer  
- MongoDB reachable at **`mongodb://127.0.0.1:27017/selftest_handoff`** (see `server/.env.handoff`)

### Option A — Docker (simplest)

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/), then use **`npm run setup`** below so Compose starts Mongo for you.

### Option B — MongoDB already installed (no Docker)

Start your MongoDB daemon locally on port **27017**, then from the project root run **`npm run setup:lite`** instead of **`npm run setup`** (see below). The database name **`selftest_handoff`** will be created when you seed.

## One-time setup (from the project root)

```powershell
npm install
npm run setup
```

If you are **not** using Docker, use:

```powershell
npm install
npm install --prefix server
npm install --prefix client
npm run setup:lite
```

This will:

1. Install server and client dependencies  
2. Start MongoDB in Docker (`docker compose up -d`)  
3. Wait until the database accepts connections  
4. Seed all problems into the database  

## Run the app

```powershell
npm run dev
```

- Client: **http://localhost:5173**  
- API: **http://localhost:5000**

## Gate / passcode (assessor)

Default **`UNLOCK_KEY`** and **`MONGODB_URI`** live in **`server/.env.handoff`** and the same JSON in [`config/embedded.config.handoff.json`](config/embedded.config.handoff.json) (for your desktop app / mint script). See [`docs/desktop-unlock.md`](docs/desktop-unlock.md). The **`desktop/`** folder is gitignored so you can keep a local unlock app there without pushing it to GitHub.

Mint a passcode for a candidate’s challenge string. **`mintUnlockToken.js`** merges **`config/embedded.config.handoff.json`**, then optional files under **`desktop/`** if you create them, then **`process.env`**.

For **Atlas**, use **`desktop/embedded.config.json`** (local only, not pushed) or **`server/.env`** with `MONGODB_URI`, or shell env.

```powershell
cd server
node scripts/mintUnlockToken.js --challengeCode "PASTE_CHALLENGE_FROM_CANDIDATE_UI"
```

Send the printed passcode back to the candidate. The candidate’s machine does **not** need its own `.env` unless you want to override defaults.

## Overrides (optional)

Create **`server/.env`** (gitignored) with any variable you want to override; it is loaded after `.env.handoff`.

## Stop MongoDB

```powershell
npm run docker:down
```
