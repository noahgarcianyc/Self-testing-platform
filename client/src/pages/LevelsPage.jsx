import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLevels } from "../api.js";
import { useProgress } from "../ProgressContext.jsx";

export default function LevelsPage() {
  const nav = useNavigate();
  const { myProgress, refreshMyProgress, connect } = useProgress();
  const [levels, setLevels] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    connect();
    refreshMyProgress();
  }, [connect, refreshMyProgress]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getLevels();
        if (!cancelled) setLevels(data.levels || []);
      } catch (e) {
        if (!cancelled) {
          setErr(e.message);
          if (e.message.includes("Authentication") || e.message.includes("required")) {
            nav("/", { replace: true });
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, [nav]);

  const totalSolved = myProgress?.totalSolved || 0;
  const totalProblems = myProgress?.totalProblems || 0;
  const pct = totalProblems ? Math.round((totalSolved / totalProblems) * 100) : 0;
  const solvedByLevel = myProgress?.solvedByLevel || {};
  const countByLevel = myProgress?.problemCountByLevel || {};

  return (
    <div className="max-w-[480px] mx-auto px-5 pt-10">
      <h1 className="text-2xl font-bold mb-4">Choose difficulty</h1>

      {myProgress && (
        <div className="bg-surface border border-border rounded-[10px] p-4 mb-5">
          <p className="font-semibold text-[0.95rem] mb-2">
            {myProgress.name ? `${myProgress.name}'s progress` : "Your progress"}
          </p>
          <div className="h-2.5 rounded-[5px] bg-border overflow-hidden">
            <div
              className="h-full rounded-[5px] bg-gradient-to-r from-accent to-[#5588dd] transition-all duration-[400ms]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[0.82rem] text-muted">
            {totalSolved} / {totalProblems} solved ({pct}%)
          </p>
          <div className="flex gap-4 mt-2 flex-wrap">
            {[1, 2, 3].map((l) => (
              <span key={l} className="text-[0.8rem] text-muted">
                Level {l}: {solvedByLevel[l] || 0}/{countByLevel[l] || "?"}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-muted text-[0.95rem] mb-4">Each level has 15 problems.</p>
      {err && <p className="text-error text-[0.9rem]">{err}</p>}
      <ul className="list-none m-0 p-0 flex flex-col gap-3">
        {levels.map((l) => (
          <li key={l.id}>
            <Link
              className="flex justify-between items-center p-4 bg-surface border border-border rounded-[10px] no-underline text-text transition-colors hover:border-accent-dim hover:bg-[#1c2230]"
              to={`/levels/${l.id}`}
            >
              <span className="font-semibold">Level {l.id}</span>
              <span className="text-[0.85rem] text-muted">
                {solvedByLevel[l.id] || 0}/{l.problemCount} solved
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="mt-8 text-center">
        <Link className="text-[0.85rem] text-muted no-underline hover:text-accent" to="/admin">
          Admin dashboard
        </Link>
      </footer>
    </div>
  );
}
