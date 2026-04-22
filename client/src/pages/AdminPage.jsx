import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminProgress } from "../api.js";
import { useProgress } from "../ProgressContext.jsx";

export default function AdminPage() {
  const nav = useNavigate();
  const { allProgress, connect } = useProgress();
  const [initial, setInitial] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    connect();
    let cancelled = false;
    (async () => {
      try {
        const data = await getAdminProgress();
        if (!cancelled) setInitial(data);
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
  }, [connect, nav]);

  const participants = allProgress.length > 0 ? allProgress : (initial?.participants || []);
  const totalProblems = initial?.totalProblems || 45;
  const countByLevel = initial?.problemCountByLevel || { 1: 15, 2: 15, 3: 15 };

  return (
    <div className="max-w-[720px] mx-auto px-5 pt-10">
      <nav className="mb-4">
        <Link to="/levels" className="text-[0.9rem] no-underline">&larr; Back to levels</Link>
      </nav>
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted text-[0.92rem] mb-5">
        Real-time participant progress. Updates live when someone passes a problem.
      </p>
      {err && <p className="text-error text-[0.9rem]">{err}</p>}

      {participants.length === 0 ? (
        <p className="text-muted italic">No participants yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.9rem]">
            <thead>
              <tr>
                <th className="p-2.5 text-center border-b border-border bg-surface font-semibold text-[0.82rem] uppercase tracking-wider sticky top-0">
                  Name
                </th>
                <th className="p-2.5 text-center border-b border-border bg-surface font-semibold text-[0.82rem] uppercase tracking-wider sticky top-0">
                  Level 1<br /><span className="font-normal text-[0.72rem] text-muted">/{countByLevel[1] || "?"}</span>
                </th>
                <th className="p-2.5 text-center border-b border-border bg-surface font-semibold text-[0.82rem] uppercase tracking-wider sticky top-0">
                  Level 2<br /><span className="font-normal text-[0.72rem] text-muted">/{countByLevel[2] || "?"}</span>
                </th>
                <th className="p-2.5 text-center border-b border-border bg-surface font-semibold text-[0.82rem] uppercase tracking-wider sticky top-0">
                  Level 3<br /><span className="font-normal text-[0.72rem] text-muted">/{countByLevel[3] || "?"}</span>
                </th>
                <th className="p-2.5 text-center border-b border-border bg-surface font-semibold text-[0.82rem] uppercase tracking-wider sticky top-0">
                  Total<br /><span className="font-normal text-[0.72rem] text-muted">/{totalProblems}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-surface">
                  <td className="p-2.5 border-b border-border text-left font-medium">{p.name}</td>
                  <td className="p-2.5 border-b border-border text-center font-mono">{p.solvedByLevel?.[1] || 0}</td>
                  <td className="p-2.5 border-b border-border text-center font-mono">{p.solvedByLevel?.[2] || 0}</td>
                  <td className="p-2.5 border-b border-border text-center font-mono">{p.solvedByLevel?.[3] || 0}</td>
                  <td className="p-2.5 border-b border-border text-center font-mono font-bold">{p.totalSolved || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
