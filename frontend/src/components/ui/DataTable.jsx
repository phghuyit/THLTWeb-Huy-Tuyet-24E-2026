"use client";

import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { IconChevronDown } from "./Icons";
import { EmptyState, Skeleton } from "./Primitives";

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className,
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= Math.max(1, totalPages); i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-[12.5px] text-ink-2", className)}>
      <div>
        <span>
          Hiển thị <span className="font-semibold text-ink">{startItem}</span> -{" "}
          <span className="font-semibold text-ink">{endItem}</span> trên{" "}
          <span className="font-semibold text-ink">{totalItems}</span> bản ghi
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-8 min-w-[32px] items-center justify-center rounded border border-line bg-surface px-2.5 font-medium transition-colors hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          Trước
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-ink-3 select-none">
                ...
              </span>
            );
          }
          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "inline-flex h-8 min-w-[32px] items-center justify-center rounded border px-2.5 font-medium transition-colors",
                isCurrent
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface hover:bg-surface-2 hover:text-ink"
              )}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex h-8 min-w-[32px] items-center justify-center rounded border border-line bg-surface px-2.5 font-medium transition-colors hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          Sau
        </button>
      </div>
    </div>
  );
}

export function DataTable({
  columns = [],
  rows = [],
  data,
  getKey,
  density = "comfortable",
  loading = false,
  empty,
  onRowClick,
  pagination = true,
  pageSize = 10,
}) {
  const effectiveRows = useMemo(() => {
    if (Array.isArray(rows) && rows.length > 0) return rows;
    if (Array.isArray(data)) return data;
    return rows || [];
  }, [rows, data]);

  const [sort, setSort] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const sortedRows = useMemo(() => {
    if (!sort) return effectiveRows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return effectiveRows;
    const copy = [...effectiveRows];
    copy.sort((a, b) => {
      const va = col.sortValue(a);
      const vb = col.sortValue(b);
      const r = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "vi");
      return sort.dir === "asc" ? r : -r;
    });
    return copy;
  }, [effectiveRows, sort, columns]);

  const totalPages = Math.ceil(sortedRows.length / pageSize);

  const paginatedRows = useMemo(() => {
    if (!pagination) return sortedRows;
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, pagination, currentPage, pageSize]);

  if (loading) {
    return (
      <div className="card p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (sortedRows.length === 0) {
    return <div className="card">{empty || <EmptyState title="Không có dữ liệu" body="Chưa có bản ghi nào." />}</div>;
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line bg-surface-2 text-[12px] font-semibold text-ink-2 uppercase tracking-wider">
              {columns.map((col) => {
                const sortable = Boolean(col.sortValue);
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={cn("px-4 py-3", col.align === "right" && "text-right")}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleSortChange(
                            active
                              ? { key: col.key, dir: sort.dir === "asc" ? "desc" : "asc" }
                              : { key: col.key, dir: "asc" }
                          )
                        }
                        className="inline-flex items-center gap-1 hover:text-ink"
                      >
                        {col.header}
                        <IconChevronDown
                          width={12}
                          height={12}
                          className={cn("transition-transform", active ? (sort.dir === "asc" ? "rotate-180" : "") : "opacity-30")}
                        />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-[13px]">
            {paginatedRows.map((row) => {
              const key = getKey ? getKey(row) : row.id || row.slug || row.code;
              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn("transition-colors hover:bg-line-2/40", onRowClick && "cursor-pointer")}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        density === "compact" ? "px-4 py-2" : "px-4 py-3.5",
                        col.align === "right" && "text-right"
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedRows.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
