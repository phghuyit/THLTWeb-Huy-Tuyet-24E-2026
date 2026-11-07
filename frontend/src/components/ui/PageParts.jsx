"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconChevronRight, IconClose, IconSearch } from "./Icons";
import { SegmentedControl } from "./Primitives";

export function PageHeader({ title, description, breadcrumb, actions }) {
  return (
    <header className="mb-6">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-2 flex items-center gap-1 text-[12px] text-ink-3">
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {b.href ? (
                <Link href={b.href} className="hover:text-ink">
                  {b.label}
                </Link>
              ) : (
                <span>{b.label}</span>
              )}
              {i < breadcrumb.length - 1 && <IconChevronRight width={12} height={12} />}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="h-page">{title}</h1>
          {description && <p className="mt-1 text-[13px] text-ink-2">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function Toolbar({
  search = "",
  onSearch,
  searchPlaceholder = "Tìm kiếm...",
  quickFilters = [],
  activeQuick,
  onQuickChange,
  density,
  onDensityChange,
  resultLabel,
  right,
}) {
  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <IconSearch width={14} height={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="field pl-8"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
            >
              <IconClose width={12} height={12} />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {resultLabel && <span className="text-[12px] text-ink-2">{resultLabel}</span>}
          {density && onDensityChange && (
            <SegmentedControl
              size="sm"
              value={density}
              onChange={onDensityChange}
              options={[
                { key: "comfortable", label: "Thoáng" },
                { key: "compact", label: "Gọn" },
              ]}
            />
          )}
          {right}
        </div>
      </div>

      {quickFilters.length > 0 && onQuickChange && (
        <div className="flex flex-wrap gap-1.5">
          {quickFilters.map((q) => {
            const active = activeQuick === q.key;
            return (
              <button
                key={q.key}
                type="button"
                onClick={() => onQuickChange(q.key)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-surface text-ink-2 hover:border-ink-3 hover:text-ink"
                )}
              >
                {q.label}
                {q.count !== undefined && <span className="ml-1.5 opacity-70">({q.count})</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StatCard({ label, value, sub, tone = "neutral", href, icon }) {
  const toneClass = {
    neutral: "text-ink",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    info: "text-info",
  }[tone] || "text-ink";

  const content = (
    <div className="card card-pad flex h-full flex-col justify-between transition-colors hover:border-ink-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-medium text-ink-2">{label}</p>
        {icon && <span className="text-ink-3">{icon}</span>}
      </div>
      <p className={cn("num mt-2 text-2xl font-semibold", toneClass)}>{value}</p>
      {sub && <p className="mt-2 text-[11.5px] text-ink-3">{sub}</p>}
    </div>
  );

  return href ? <Link href={href} className="block">{content}</Link> : content;
}

export function Section({ title, description, action, children, className }) {
  return (
    <section className={cn("min-w-0", className)}>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="h-section">{title}</h2>
          {description && <p className="mt-0.5 text-[12px] text-ink-2">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
