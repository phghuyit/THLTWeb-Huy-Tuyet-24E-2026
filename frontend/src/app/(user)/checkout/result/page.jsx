"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/services/api";
import { useCart } from "@/store/cart";
import { formatVnd } from "@/lib/money";
import { IconCheck, IconAlert } from "@/components/ui/Icons";

function ResultContent() {
  const searchParams = useSearchParams();
  const { clear: clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState(null);

  const orderCode = searchParams.get("code") || searchParams.get("vnp_TxnRef") || "SR-TEST";
  const vnpResponseCode = searchParams.get("vnp_ResponseCode");
  const queryStatus = searchParams.get("status");

  const isSuccess = vnpResponseCode === "00" || queryStatus === "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      try {
        const saved = window.sessionStorage.getItem("last_order");
        if (saved) setOrder(JSON.parse(saved));
      } catch {
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      clearCart();
    }

    async function syncPaymentStatus() {
      const allParams = {};
      searchParams.forEach((val, key) => {
        allParams[key] = val;
      });

      if (vnpResponseCode) {
        try {
          await api.get("/payment/vnpay/return", { params: allParams });
        } catch {
        }
      }
    }

    syncPaymentStatus();
  }, [searchParams, vnpResponseCode, isSuccess, clearCart]);

  return (
    <div className="shell py-16 md:py-24 max-w-2xl mx-auto">
      <div className="bg-surface border border-line p-8 rounded-sm shadow-sm text-center">
        <div
          className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full text-white ${
            isSuccess ? "bg-success" : "bg-danger"
          }`}
        >
          {isSuccess ? <IconCheck width={28} height={28} /> : <IconAlert width={28} height={28} />}
        </div>

        <h1 className="text-2xl font-bold font-serif text-ink mb-2">
          {isSuccess ? "Đặt đơn thuê thành công!" : "Thanh toán chưa hoàn tất"}
        </h1>

        <p className="text-sm text-ink-2 mb-6">
          {isSuccess
            ? `Cảm ơn bạn đã đặt thuê tại StyleRent. Đơn hàng #${orderCode} đã được thanh toán và xác nhận thành công.`
            : `Giao dịch #${orderCode} đã bị hủy hoặc có lỗi trong quá trình thanh toán. Đơn hàng đã được chuyển sang trạng thái đã hủy.`}
        </p>

        {mounted && order && (
          <div className="bg-warm/50 border border-line p-5 rounded-sm text-left text-xs space-y-2.5 mb-8">
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-ink-2">Mã đơn hàng:</span>
              <strong className="text-ink font-mono text-sm">#{order.orderCode}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-2">Người nhận:</span>
              <span className="font-medium text-ink">{order.name} ({order.phone})</span>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-2">Địa chỉ giao:</span>
              <span className="font-medium text-ink text-right max-w-[260px] truncate">{order.address}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-2">Phương thức:</span>
              <span className="font-medium text-ink">
                {order.paymentMethod === "vnpay" ? "Cổng online VNPay" : "Thanh toán khi nhận đồ (COD)"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-2">Trạng thái đơn:</span>
              <span className={`font-semibold ${isSuccess ? "text-emerald-700" : "text-rose-700"}`}>
                {isSuccess ? "Đã xác nhận" : "Đã hủy"}
              </span>
            </div>

            <div className="flex justify-between border-t border-line pt-2 text-sm font-bold text-ink">
              <span>Tổng thanh toán:</span>
              <span className="text-accent">{formatVnd(order.totalAmount)}</span>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Link href="/products" className="btn btn-outline text-xs">
            Tiếp tục xem đồ
          </Link>

          <Link href="/orders" className="btn text-xs">
            Xem đơn thuê của tôi
          </Link>

          {!isSuccess && (
            <Link href="/checkout" className="btn btn-outline text-xs">
              Thử đặt lại
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-24 text-center">
          <p className="text-sm text-ink-2">Đang tải thông tin đơn hàng...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
