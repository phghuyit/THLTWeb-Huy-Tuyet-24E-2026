"use client";

import Link from "next/link";
import { IconCalendar } from "@/components/ui/Icons";

export function HomeDateBar() {
  return (
    <div className="border-b border-line bg-canvas">
      <div className="shell flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <IconCalendar className="shrink-0 text-ink-2" />
          <div className="min-w-0">
            <p className="text-[13.5px]">Bạn cần đồ cho ngày nào?</p>
            <p className="mt-0.5 text-[12px] text-ink-2">
              Chọn ngày nhận và ngày trả để xem chính xác món nào còn rảnh. Đặt trước tối đa 90 ngày.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/products" className="btn btn-quiet">
            Chọn ngày thuê
          </Link>
          <Link href="/products" className="btn btn-sm">
            Xem đồ còn trống
          </Link>
        </div>
      </div>
    </div>
  );
}
