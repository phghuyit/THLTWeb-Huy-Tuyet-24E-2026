"use client";

import { useEffect, useRef, useState } from "react";
import { useRevealRef } from "@/hooks";
import { cn } from "@/lib/utils";
import { IconChevronDown, IconMinus, IconPlus, IconStar } from "./Icons";

export function Reveal({
  children,
  delay = 0,
  y,
  as: Tag = "div",
  className,
}) {
  const revealRef = useRevealRef();
  const style = { "--reveal-delay": `${delay}ms` };
  if (y !== undefined) style["--reveal-y"] = `${y}px`;
  return (
    <Tag ref={revealRef} data-reveal className={className} style={style}>
      {children}
    </Tag>
  );
}

export function ClipHeading({ lines, className }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="clip-mask">
          <span style={{ transitionDelay: `${i * 90}ms` }}>{line}</span>
        </span>
      ))}
    </span>
  );
}

const TONE_BG = {
  neutral: "bg-stone-100 text-stone-600 border border-stone-200/80",
  info: "bg-sky-50 text-sky-700 border border-sky-200/80",
  accent: "bg-amber-50 text-amber-700 border border-amber-200/80",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
  warning: "bg-amber-50 text-amber-700 border border-amber-200/80",
  danger: "bg-rose-50 text-rose-700 border border-rose-200/80",
  ink: "bg-ink text-white",
};

export function StatusChip({ tone = "neutral", children, dot = true, className }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium", TONE_BG[tone] || TONE_BG.neutral, className)}>
      {dot && <Dot tone={tone} />}
      {children}
    </span>
  );
}

export function Chip({ children, tone = "neutral", className }) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider rounded-sm", TONE_BG[tone] || TONE_BG.neutral, className)}>
      {children}
    </span>
  );
}

export function Dot({ tone = "neutral" }) {
  const bg = {
    neutral: "bg-stone-400",
    info: "bg-sky-500",
    accent: "bg-amber-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  };
  return <span className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", bg[tone] || "bg-stone-400")} />;
}

export function Skeleton({ className }) {
  return <div className={cn("skeleton rounded", className)} aria-hidden />;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function EmptyState({ icon, title, body, action, compact }) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 text-center", compact ? "py-8" : "py-16")}>
      {icon && <div className="mb-3 text-ink-3">{icon}</div>}
      <p className="text-[14px] font-medium">{title}</p>
      <p className="mt-1.5 max-w-[46ch] text-[12.5px] leading-relaxed text-ink-2">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function KeyValue({ label, children, align = "between" }) {
  if (align === "stack") {
    return (
      <div>
        <p className="text-[11.5px] text-ink-3">{label}</p>
        <div className="mt-0.5 text-[13px]">{children}</div>
      </div>
    );
  }
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-[12.5px] text-ink-2">{label}</span>
      <span className="num text-right text-[13px]">{children}</span>
    </div>
  );
}

export function MoreMenu({ items = [], label = "Thao tác" }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={wrap} className="relative inline-block text-left">
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="btn btn-outline btn-sm px-2 text-[12px]"
      >
        •••
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 min-w-[180px] rounded border border-line bg-surface py-1 shadow-md">
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onSelect?.();
              }}
              className={cn(
                "flex w-full px-3 py-1.5 text-left text-[12.5px] transition-colors",
                item.danger ? "text-danger hover:bg-danger-soft" : "hover:bg-line-2",
                item.disabled && "cursor-not-allowed opacity-40 hover:bg-transparent"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SegmentedControl({ options = [], value, onChange, size = "md" }) {
  return (
    <div className="inline-flex shrink-0 rounded border border-line bg-surface p-0.5">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={cn(
            "rounded px-2.5 transition-colors",
            size === "sm" ? "h-[24px] text-[12px]" : "h-[28px] text-[12.5px]",
            value === o.key ? "bg-ink text-white" : "text-ink-2 hover:text-ink"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Meter({ value = 0, tone = "info" }) {
  const bg = {
    neutral: "bg-ink-3",
    info: "bg-info",
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-line-2">
      <span
        className={cn("block h-full rounded-full transition-all duration-300", bg[tone] || "bg-info")}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </span>
  );
}

export function Stars({ value = 5, size = 13, showValue = false }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <IconStar
            key={i}
            width={size}
            height={size}
            filled={i <= Math.round(value)}
            className={i <= Math.round(value) ? "text-ink" : "text-ink-3"}
          />
        ))}
      </span>
      {showValue && <span className="text-[12px] text-ink-2">{Number(value).toFixed(1).replace(".", ",")}</span>}
    </span>
  );
}

export function Note({ tone = "info", children, icon }) {
  const tones = {
    info: "bg-warm text-ink-2",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
  };
  return (
    <div className="flex items-start gap-3 rounded-sm p-3.5 text-[13px] leading-relaxed">
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function QuantityStepper({
  value,
  min = 1,
  max = 9,
  onChange,
  compact = false,
}) {
  const size = compact ? "h-9 w-9" : "h-11 w-11";
  return (
    <div className="inline-flex items-center border border-line bg-surface">
      <button
        type="button"
        aria-label="Giảm số lượng"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(size, "grid place-items-center transition-colors hover:bg-warm disabled:opacity-30")}
      >
        <IconMinus width={14} height={14} />
      </button>
      <span className={cn("min-w-9 text-center text-sm tabular-nums", compact && "text-[13px]")}>{value}</span>
      <button
        type="button"
        aria-label="Tăng số lượng"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(size, "grid place-items-center transition-colors hover:bg-warm disabled:opacity-30")}
      >
        <IconPlus width={14} height={14} />
      </button>
    </div>
  );
}

export function Accordion({ items = [], defaultOpen = -1 }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-line">
      {items.map((item, i) => (
        <AccordionRow
          key={i}
          title={item.title}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? -1 : i)}
        >
          {item.content}
        </AccordionRow>
      ))}
    </div>
  );
}

function AccordionRow({ title, isOpen, onToggle, children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    setHeight(isOpen ? ref.current.scrollHeight : 0);
  }, [isOpen, children]);

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-accent"
      >
        <span className="text-[15px] font-medium">{title}</span>
        <IconChevronDown
          width={16}
          height={16}
          className={cn("shrink-0 transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>
      <div
        style={{ height }}
        className="overflow-hidden transition-[height] duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
      >
        <div ref={ref} className="pb-6 text-[14px] leading-relaxed text-ink-2">
          {children}
        </div>
      </div>
    </div>
  );
}
