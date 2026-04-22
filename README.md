# MERN Self-Testing Platform

**Ready-to-run local setup (Docker + defaults, no `.env` required):** see [QUICKSTART.md](QUICKSTART.md).

This project was designed to test candidates' practical MERN stack skills.

You should solve as many problems as possible within **10 minutes**. You may use any resources available, but you must be able to explain your solutions line by line.

**One catch:** To run the project and begin the challenge, you must first fix a connection error between the backend and frontend. Once the project is running, you will receive a challenge code. Provide this code to me to receive the passcode and the database URL required to retrieve the data.

---

## Getting started

For **Docker + seeded DB + committed defaults** (no hand-written `server/.env`), use [QUICKSTART.md](QUICKSTART.md): `npm install` → `npm run setup` → `npm run dev`.

### 1. Install dependencies

```powershell
cd server
npm install
```

```powershell
cd client
npm install
```

### 2. Start the server and client

Open two terminals:

```powershell
cd server
npm run dev
```

```powershell
cd client
npm run dev
```

The client opens at **http://localhost:5173** and the server runs at **http://localhost:5000**.

### 3. Unlock the platform

When you open the app for the first time you'll see the **Gate** page.

1. Click **Show challenge** — a challenge code appears on screen.
2. Send this challenge code to your administrator (the person who set up this platform).
3. The administrator gives you back a **passcode** — a long encoded string.
4. Paste the passcode into the text area and click **Continue**.

Once verified you'll be connected to the problem database.

### 4. Enter your name

After unlocking you'll be asked to enter your name. This is used to track your progress — there are no accounts or passwords.

### 5. Solve problems

- Choose a difficulty level: **Level 1** (Easy), **Level 2** (Medium), or **Level 3** (Hard).
- Each level has **15 problems** covering backend (Express, Mongoose), frontend (React), and full-stack topics.
- Select a problem to see its description and starter code with `// TODO:` comments guiding you through the solution.
- Type your answer in the editor and click **Submit answer**.
- The server checks your answer and shows **Passed** or **Not passed** immediately.

### 6. Track your progress

- The **Levels** page shows a progress bar with how many problems you've solved out of 45, broken down by level.
- On each level's problem list, solved problems are marked with a green **Passed** badge.
- Progress updates in real time — if you solve a problem in one tab, other tabs reflect it automatically.

## Problem levels

| Level | Difficulty | Target | Topics |
|-------|-----------|--------|--------|
| 1 | Easy | Junior developers | Basic Express routes, Mongoose schemas, React components with useState, simple CRUD |
| 2 | Medium | Mid-level developers | Pagination, custom hooks, validation (Zod), React Query, service layers, Context API |
| 3 | Hard | Senior developers | Socket.io, aggregation pipelines, auth middleware, performance optimization, security hardening |

## Admin dashboard

Navigate to **http://localhost:5173/admin** (or click the "Admin dashboard" link at the bottom of the Levels page) to see a real-time table of all participants and their progress. This page updates live as users solve problems.

## FAQ

**Q: Do I need a database URL or any secrets?**
No. The administrator handles database access. You just need the passcode they give you.

**Q: Can I restart if I want to try again?**
Clear your browser cookies for localhost:5173 and reload. You'll go through the gate and name entry again.

**Q: Why did my session expire?**
Sessions last 8 hours. After that, ask your administrator for a new passcode.

**Q: Can I see the correct answers?**
No. The API never sends correct answers to the browser. The server checks your submission and only tells you if it passed or not.
