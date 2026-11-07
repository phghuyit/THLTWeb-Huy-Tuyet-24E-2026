"use client";

import { formatVnd } from "@/lib/money";
import { cn } from "@/lib/utils";

function Row({
  label,
  value,
  tone = "default",
  hint,
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2">
      <span
        className={cn(
          "text-[13.5px]",
          tone === "muted" && "text-ink-2",
          tone === "strong" && "text-[15px] font-medium",
          tone === "deposit" && "text-ink",
        )}
      >
        {label}
        {hint && <span className="ml-1.5 text-[11.5px] text-ink-3">{hint}</span>}
      </span>
      <span
        className={cn(
          "shrink-0 text-[13.5px] tabular-nums",
          tone === "discount" && "text-success",
          tone === "strong" && "text-[16px] font-bold text-ink",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function PriceBreakdown({
  quote,
  showDueSplit = true,
  className,
}) {
  if (!quote) return null;

  return (
    <div className={cn("border-t border-line pt-4", className)}>
      <Row label="Tiền thuê" value={formatVnd(quote.subtotalRental)} />

      {quote.discount > 0 && (
        <Row
          label={`Giảm giá ${quote.discountLabel ? `(${quote.discountLabel})` : ""}`}
          value={`-${formatVnd(quote.discount)}`}
          tone="discount"
        />
      )}

      {quote.shippingFee > 0 && (
        <Row label="Phí giao nhận" value={formatVnd(quote.shippingFee)} />
      )}

      <Row
        label="Tiền cọc giữ đồ"
        value={formatVnd(quote.totalDeposit)}
        hint="(hoàn lại 100% khi trả)"
        tone="deposit"
      />

      <div className="my-2 border-t border-line" />

      <Row
        label="Tổng cộng"
        value={formatVnd(quote.grandTotal)}
        tone="strong"
      />

      {showDueSplit && quote.dueOnPickup > 0 && (
        <div className="mt-2 rounded bg-warm p-3 text-[12px] text-ink-2 space-y-1">
          <div className="flex justify-between">
            <span>Thanh toán online (cọc + 30% thuê):</span>
            <span className="font-semibold text-ink">{formatVnd(quote.dueNow)}</span>
          </div>
          <div className="flex justify-between">
            <span>Thanh toán khi nhận đồ (70% thuê còn lại):</span>
            <span className="font-semibold text-ink">{formatVnd(quote.dueOnPickup)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
