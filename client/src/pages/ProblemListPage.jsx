import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProblems } from "../api.js";
import { useProgress } from "../ProgressContext.jsx";

export default function ProblemListPage() {
  const { level } = useParams();
  const nav = useNavigate();
  const { myProgress } = useProgress();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const levelNum = Number(level);
  const levelOk = [1, 2, 3].includes(levelNum);

  const solvedIds = new Set(myProgress?.solvedProblemIds || []);

  useEffect(() => {
    if (!levelOk) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await getProblems(levelNum);
        if (!cancelled) setItems(list);
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
  }, [levelNum, levelOk, nav]);

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8">
      <nav className="mb-4">
        <Link to="/levels" className="text-[0.9rem] no-underline">&larr; Levels</Link>
      </nav>
      <h1 className="capitalize text-[1.35rem] font-bold mb-5">Level {level}</h1>
      {!levelOk && <p className="text-error">Invalid level.</p>}
      {err && <p className="text-error">{err}</p>}
      <ol className="list-none m-0 p-0 flex flex-col gap-2">
        {items.map((p) => {
          const solved = solvedIds.has(p._id);
          return (
            <li key={p._id}>
              <Link
                className={`flex gap-3 items-baseline px-4 py-3.5 bg-surface border rounded-lg no-underline text-text hover:border-accent-dim ${solved ? "border-[#2d6a4f]" : "border-border"}`}
                to={`/levels/${level}/${p._id}`}
              >
                <span className="font-mono text-[0.8rem] text-muted min-w-[1.75rem]">{p.order}.</span>
                <span className="font-medium flex-1">{p.title}</span>
                {solved && (
                  <span className="text-[0.72rem] font-semibold px-2 py-0.5 rounded-md bg-[#2d6a4f] text-[#b7e4c7] uppercase tracking-wider shrink-0">
                    Passed
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
