import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { getProgress } from "./api.js";

const ProgressCtx = createContext(null);

// In dev, API + Socket.io run on :5000 while Vite is on :5173 — empty VITE_API_URL would wrongly use :5173.
const SOCKET_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

export function ProgressProvider({ children }) {
  const [myProgress, setMyProgress] = useState(null);
  const [allProgress, setAllProgress] = useState([]);
  const socketRef = useRef(null);

  const refreshMyProgress = useCallback(async () => {
    try {
      const data = await getProgress();
      setMyProgress(data);
    } catch {
      /* session may not exist yet */
    }
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;
    const s = io(SOCKET_URL, { withCredentials: true, transports: ["websocket", "polling"] });
    socketRef.current = s;

    s.on("connect", () => {
      s.emit("requestProgress");
    });

    s.on("progressUpdate", (data) => {
      setAllProgress(data);
      refreshMyProgress();
    });

    s.on("connect_error", () => {
      /* will retry automatically */
    });
  }, [refreshMyProgress]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  }, []);

  useEffect(() => () => disconnect(), [disconnect]);

  return (
    <ProgressCtx.Provider
      value={{ myProgress, allProgress, refreshMyProgress, connect, disconnect }}
    >
      {children}
    </ProgressCtx.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error("useProgress must be inside ProgressProvider");
  return ctx;
}
