"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/hooks";
import { cn } from "@/lib/utils";
import { IconClose } from "./Icons";

function Portal({ children }) {
  const mounted = useMounted();
  if (!mounted) return null;
  return createPortal(children, document.body);
}

function Scrim({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity"
    />
  );
}

export function Drawer({ open, onClose, title, subtitle, children, footer, width = "max-w-md" }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <Scrim onClick={onClose} />
      <aside
        role="dialog"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-line bg-surface shadow-2xl transition-transform",
          width
        )}
      >
        <header className="flex items-start justify-between border-b border-line px-5 py-4">
          <div>
            <h3 className="text-[15px] font-semibold">{title}</h3>
            {subtitle && <p className="mt-0.5 text-[12px] text-ink-2">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="btn-ghost p-1">
            <IconClose width={16} height={16} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="border-t border-line bg-surface-2 p-4">{footer}</div>}
      </aside>
    </Portal>
  );
}

export function Modal({ open, onClose, title, description, children, footer, width = "max-w-lg" }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose?.();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <Scrim onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "pointer-events-auto flex max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] w-full flex-col rounded-lg border border-line bg-surface shadow-2xl transition-all",
            width
          )}
        >
          <header className="flex shrink-0 items-start justify-between border-b border-line px-5 py-4">
            <div>
              <h3 className="text-[15px] font-semibold">{title}</h3>
              {description && <p className="mt-0.5 text-[12px] text-ink-2">{description}</p>}
            </div>
            <button type="button" onClick={onClose} className="btn-ghost p-1" aria-label="Đóng">
              <IconClose width={16} height={16} />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto overscroll-contain p-5">{children}</div>
          {footer && <div className="flex shrink-0 justify-end gap-2 border-t border-line bg-surface-2 px-5 py-3">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}
