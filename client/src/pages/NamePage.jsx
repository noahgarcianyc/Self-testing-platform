import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postName } from "../api.js";
import { useProgress } from "../ProgressContext.jsx";

export default function NamePage() {
  const nav = useNavigate();
  const { connect, refreshMyProgress } = useProgress();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setErr("");
    setLoading(true);
    try {
      const data = await postName(name.trim());
      localStorage.setItem("participantName", data.name);
      connect();
      await refreshMyProgress();
      nav("/levels");
    } catch (e) {
      setErr(e.message);
      if (e.message.includes("Authentication") || e.message.includes("required")) {
        nav("/", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-[420px] bg-surface border border-border rounded-[14px] px-7 py-8">
        <h1 className="text-[1.35rem] font-bold mb-2">Before you start</h1>
        <p className="text-muted text-[0.92rem] mb-6">
          Enter your name so we can track your progress across problems.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            className="w-full p-3 rounded-lg border border-border bg-bg text-text text-base focus:outline-2 focus:outline-accent-dim focus:outline-offset-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            required
            maxLength={60}
          />
          {err && <p className="text-sm text-error">{err}</p>}
          <button
            type="submit"
            className="px-5 py-2.5 border-none rounded-lg font-semibold text-[0.95rem] cursor-pointer bg-gradient-to-br from-accent to-[#5588dd] text-[#0a0e14] self-start disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !name.trim()}
          >
            {loading ? "Saving…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
