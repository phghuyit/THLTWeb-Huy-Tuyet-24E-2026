"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { orderService } from "@/services/orderService";
import { formatVnd } from "@/lib/money";
import { formatDate } from "@/lib/date";
import { ORDER_STATUS } from "@/lib/order-status";
import { Pagination } from "@/components/ui/DataTable";

const ORDERS_PER_PAGE = 5;

export default function UserOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="shell py-24 text-center">
        <p className="text-sm text-ink-2">Đang tải danh sách đơn thuê của bạn...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="shell py-24 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold font-serif mb-3">Đơn thuê của tôi</h1>
        <p className="text-sm text-ink-2 mb-6">
          Vui lòng đăng nhập tài khoản để xem và theo dõi tình trạng các đơn thuê trang phục của bạn.
        </p>
        <Link href="/login" className="btn">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-12 md:py-16 max-w-4xl mx-auto">
      <div className="mb-8 border-b border-line pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-ink font-bold">Đơn thuê của tôi</h1>
          <p className="mt-1 text-sm text-ink-2">
            Theo dõi tiến độ giao nhận, lịch thuê và trạng thái hoàn cọc.
          </p>
        </div>
        <Link href="/products" className="btn btn-outline text-xs">
          + Thuê thêm đồ
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="font-serif text-lg font-bold text-ink mb-2">Bạn chưa có đơn thuê nào</p>
          <p className="text-xs text-ink-2 mb-6">
            Mọi đơn thuê sau khi đặt sẽ được hiển thị chi tiết tại đây.
          </p>
          <Link href="/products" className="btn text-xs">
            Khám phá bộ sưu tập
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders
            .slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE)
            .map((order) => {
            const statusConfig = ORDER_STATUS[order.status] || {
              label: order.status || "Chờ xử lý",
              tone: "neutral",
            };

            const toneStyles = {
              success: "bg-success-soft text-success border-success/30",
              warning: "bg-warning-soft text-warning border-warning/30",
              accent: "bg-accent-soft text-accent border-accent/30",
              danger: "bg-danger-soft text-danger border-danger/30",
              neutral: "bg-line text-ink-2 border-line",
            };

            return (
              <div key={order.code || order.id} className="card overflow-hidden">
                <div className="bg-warm/40 border-b border-line p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-ink text-sm">#{order.code}</span>
                    <span className="text-ink-3">·</span>
                    <span className="text-ink-2">Đặt ngày: {formatDate(order.createdAt?.slice(0, 10))}</span>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                      toneStyles[statusConfig.tone] || toneStyles.neutral
                    }`}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                <div className="p-4 sm:p-6 divide-y divide-line">
                  <div className="pb-4 space-y-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <img
                          src={item.image}
                          alt={item.productNameSnapshot}
                          className="h-16 w-12 object-cover rounded border border-line shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-ink truncate">{item.productNameSnapshot}</p>
                          <p className="text-xs text-ink-2 mt-0.5">
                            Size: {item.variantSnapshot?.size} · Màu: {item.variantSnapshot?.color} · SL: {item.quantity}
                          </p>
                          {order.pickupDate && (
                            <p className="text-[11px] text-ink-3 mt-0.5">
                              Kỳ thuê: {formatDate(order.pickupDate?.slice(0, 10))} → {formatDate(order.returnDate?.slice(0, 10))} ({item.rentalDays} ngày)
                            </p>
                          )}
                        </div>
                        <span className="font-semibold text-xs text-accent text-right shrink-0">
                          {formatVnd(item.lineRentalTotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="text-ink-2 space-y-1">
                      <p>Người nhận: <strong className="text-ink">{order.receiverName}</strong> ({order.receiverPhone})</p>
                      <p>Địa chỉ: <span className="text-ink">{order.address || "Nhận tại quầy"}</span></p>
                      <p>Thanh toán: <span className="text-ink">{order.paymentMethod === "vnpay" ? "Cổng VNPay" : "COD / Tiền mặt"}</span></p>
                    </div>

                    <div className="text-right ml-auto">
                      <span className="text-ink-3 text-xs block">Tổng thanh toán</span>
                      <span className="font-bold text-accent text-base block">{formatVnd(order.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(orders.length / ORDERS_PER_PAGE)}
            totalItems={orders.length}
            pageSize={ORDERS_PER_PAGE}
            onPageChange={setCurrentPage}
            className="rounded-lg border border-line bg-surface"
          />
        </div>
      )}
    </div>
  );
}
