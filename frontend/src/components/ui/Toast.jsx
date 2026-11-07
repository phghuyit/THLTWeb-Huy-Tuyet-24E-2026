"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { IconAlert, IconCheck, IconInfo } from "./Icons";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    const fallback = (t) => {
      if (typeof window !== "undefined") {
        alert(`${t.title || ""}${t.body || t.description ? `: ${t.body || t.description}` : ""}`);
      }
    };
    return {
      push: fallback,
      addToast: fallback,
    };
  }
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const rawTone = toast.tone || toast.variant;
    const tone = rawTone === "danger" ? "error" : (rawTone || "info");
    const normalized = {
      ...toast,
      tone,
      body: toast.body || toast.description || "",
      id,
    };
    setToasts((prev) => [...prev.slice(-2), normalized]);
  }, []);

  const value = useMemo(() => ({ push, addToast: push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6">
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDone={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 3500);
    return () => clearTimeout(id);
  }, [onDone]);

  const icons = {
    success: <IconCheck width={16} height={16} />,
    info: <IconInfo width={16} height={16} />,
    error: <IconAlert width={16} height={16} />,
    warning: <IconAlert width={16} height={16} />,
  };

  const tones = {
    success: "bg-surface text-ink border-success/40",
    info: "bg-surface text-ink border-line",
    error: "bg-surface text-danger border-danger/40",
    warning: "bg-surface text-warning border-warning/40",
  };

  return (
    <div className={cn("pointer-events-auto flex items-start gap-3 rounded border p-3.5 shadow-lg max-w-sm", tones[toast.tone] || tones.info)}>
      <span className="mt-0.5 shrink-0">{icons[toast.tone] || icons.info}</span>
      <div className="flex-1 text-[13px]">
        <p className="font-semibold">{toast.title}</p>
        {toast.body && <p className="mt-0.5 text-ink-2 text-[12px]">{toast.body}</p>}
      </div>
    </div>
  );
}
