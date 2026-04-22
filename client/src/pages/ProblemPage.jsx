import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProblemById, postSubmission } from "../api.js";
import { useProgress } from "../ProgressContext.jsx";

export default function ProblemPage() {
  const { level, problemId } = useParams();
  const nav = useNavigate();
  const { refreshMyProgress } = useProgress();
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await getProblemById(problemId);
        if (!cancelled) {
          setProblem(p);
          setAnswer(p.starterCode || "");
        }
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
  }, [problemId, nav]);

  const submit = async (e) => {
    e.preventDefault();
    if (!problem) return;
    setErr("");
    setResult(null);
    setSending(true);
    try {
      const r = await postSubmission({ problemId: problem._id, answer });
      setResult(r);
      if (r.passed) refreshMyProgress();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSending(false);
    }
  };

  if (!problem && !err) {
    return (
      <div className="max-w-[720px] mx-auto px-5 py-8">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto px-5 py-8 pb-12">
      <nav className="mb-4">
        <Link to={`/levels/${level}`} className="text-[0.9rem] no-underline">&larr; Level {level}</Link>
      </nav>
      {err && <p className="text-error">{err}</p>}
      {problem && (
        <>
          <h1 className="text-xl font-bold mb-4 leading-snug">
            {problem.order}. {problem.title}
          </h1>
          <div className="-mt-2 mb-4">
            <span className="inline-block text-xs uppercase tracking-widest text-muted border border-border px-2 py-0.5 rounded-md">
              {problem.type === "codeSnippet" ? "Practical (code)" : "Short answer"}
            </span>
          </div>

          <section className="mb-7" aria-labelledby="problem-heading">
            <h2 id="problem-heading" className="text-xs font-bold uppercase tracking-widest text-muted mb-2.5">
              Problem
            </h2>
            <div className="text-text whitespace-pre-wrap leading-relaxed">{problem.prompt}</div>
          </section>

          <form onSubmit={submit} className="flex flex-col gap-2">
            <label className="text-sm text-muted" htmlFor="ans">
              {problem.type === "codeSnippet"
                ? "Your code (type your solution here)"
                : "Your answer"}
            </label>
            <textarea
              id="ans"
              className="w-full p-4 rounded-lg border border-border bg-[#0a0d12] text-[#c8d0e0] font-mono text-[0.8rem] leading-snug resize-y focus:outline-2 focus:outline-accent-dim focus:outline-offset-2"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={problem.type === "codeSnippet" ? 18 : 5}
              spellCheck={false}
              placeholder={
                problem.type === "codeSnippet"
                  ? "// Write your code below, then submit for grading."
                  : "Type your answer, then submit."
              }
            />
            <button
              type="submit"
              className="self-start mt-2 px-5 py-2.5 border-none rounded-lg font-semibold cursor-pointer bg-gradient-to-br from-accent to-[#5588dd] text-[#0a0e14] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={sending}
            >
              {sending ? "Checking…" : "Submit answer"}
            </button>

            {result && (
              <div
                className={`mt-4 p-4 rounded-[10px] border ${
                  result.passed
                    ? "bg-[rgba(61,214,140,0.08)] border-[rgba(61,214,140,0.35)]"
                    : "bg-[rgba(240,113,120,0.08)] border-[rgba(240,113,120,0.35)]"
                }`}
                role="status"
                aria-live="polite"
              >
                <span className="block text-[0.7rem] font-bold uppercase tracking-widest text-muted mb-1">
                  Result
                </span>
                <p className={`m-0 text-[0.95rem] font-semibold leading-snug ${result.passed ? "text-success" : "text-error"}`}>
                  {result.passed
                    ? "Passed — your answer matched what the server expects."
                    : "Not passed — your answer did not match. You can edit and try again."}
                </p>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}
