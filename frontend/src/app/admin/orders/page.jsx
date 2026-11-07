"use client";

import { useEffect, useState, useMemo } from "react";
import { orderService } from "@/services/orderService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Overlay";
import { OrderStatusChip } from "@/components/admin/Chips";
import { useToast } from "@/components/ui/Toast";
import { formatDate, formatDateTime } from "@/lib/date";
import { formatVnd } from "@/lib/money";
import { ORDER_STATUS } from "@/lib/order-status";

export default function AdminOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOrder, setPreviewOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const codeMatch = o.code?.toLowerCase().includes(query);
        const nameMatch = o.receiverName?.toLowerCase().includes(query);
        const phoneMatch = o.receiverPhone?.toLowerCase().includes(query);
        if (!codeMatch && !nameMatch && !phoneMatch) return false;
      }

      if (selectedStatus !== "all" && o.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [orders, search, selectedStatus]);

  const hasActiveFilters = search.trim() !== "" || selectedStatus !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedStatus("all");
  };

  const loadOrders = async () => {
    setLoading(true);
    const data = await orderService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    orderService.getOrders().then((data) => {
      if (active) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = async (code, newStatus) => {
    try {
      await orderService.updateOrderStatus(code, newStatus);
      toast.push({ tone: "success", title: `Đã cập nhật trạng thái đơn #${code}` });
      await loadOrders();
      if (previewOrder?.code === code) {
        setPreviewOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi cập nhật trạng thái đơn hàng.";
      toast.push({ tone: "danger", title: msg });
    }
  };

  const columns = [
    {
      key: "code",
      header: "Mã đơn",
      sortValue: (o) => o.code,
      render: (o) => (
        <div>
          <p className="font-semibold text-ink">{o.code}</p>
          <p className="text-[11px] text-ink-3">
            {o.channel === "walk_in" ? "Tại quầy" : "Online"} · {formatDate(o.createdAt?.slice(0, 10))}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Khách hàng",
      sortValue: (o) => o.receiverName,
      render: (o) => (
        <div>
          <p className="font-medium text-ink">{o.receiverName}</p>
          <p className="text-[11.5px] text-ink-2">{o.receiverPhone}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Món thuê",
      render: (o) => (
        <span className="line-clamp-1 text-[12.5px] text-ink-2">
          {o.items?.[0]?.productNameSnapshot || "Trang phục"}
          {o.items?.length > 1 ? ` (+${o.items.length - 1})` : ""}
        </span>
      ),
    },
    {
      key: "period",
      header: "Kỳ thuê",
      render: (o) => (
        <span className="text-[12px] text-ink-2">
          {formatDate(o.pickupDate)} → {formatDate(o.returnDate)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Tổng tiền",
      align: "right",
      sortValue: (o) => o.grandTotal,
      render: (o) => <span className="font-semibold text-accent">{formatVnd(o.grandTotal)}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (o) => <OrderStatusChip status={o.status} />,
    },
    {
      key: "actions",
      header: "Chi tiết",
      align: "right",
      render: (o) => (
        <button
          type="button"
          onClick={() => setPreviewOrder(o)}
          className="btn btn-outline btn-sm"
        >
          Xem
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý đơn thuê"
        description="Toàn bộ đơn thuê trang phục của khách hàng."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3 text-xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã đơn, người nhận, số điện thoại..."
              className="field h-9 text-xs pl-8 pr-7"
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink text-sm"
                aria-label="Xóa tìm kiếm"
              >
                &times;
              </button>
            )}
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="field h-9 text-xs min-w-[160px]"
            aria-label="Lọc theo trạng thái đơn"
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.keys(ORDER_STATUS).map((st) => (
              <option key={st} value={st}>
                {ORDER_STATUS[st]?.label || st}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-ghost btn-sm h-9 px-2 text-ink-2 hover:text-danger text-xs"
            >
              Đặt lại
            </button>
          )}
        </div>

        <div className="text-ink-3 text-[11.5px] whitespace-nowrap">
          Tìm thấy <span className="font-semibold text-ink">{filteredOrders.length}</span> đơn hàng
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredOrders}
        getKey={(o) => o.code || o.id}
        loading={loading}
        pageSize={6}
      />

      <Drawer
        open={Boolean(previewOrder)}
        onClose={() => setPreviewOrder(null)}
        title={`Chi tiết đơn: ${previewOrder?.code || ""}`}
        subtitle={`${previewOrder?.receiverName || ""} · ${previewOrder?.receiverPhone || ""}`}
      >
        {previewOrder && (
          <div className="space-y-5 text-[13px]">
            <div className="flex items-center justify-between">
              <OrderStatusChip status={previewOrder.status} />
              <span className="text-[12px] text-ink-3">Tạo lúc: {formatDateTime(previewOrder.createdAt)}</span>
            </div>

            <div className="card p-3">
              <h4 className="font-semibold mb-2">Cập nhật trạng thái đơn</h4>
              <select
                value={previewOrder.status}
                onChange={(e) => handleStatusChange(previewOrder.code, e.target.value)}
                className="field"
              >
                {Object.keys(ORDER_STATUS).map((st) => (
                  <option key={st} value={st}>
                    {ORDER_STATUS[st]?.label || st}
                  </option>
                ))}
              </select>
            </div>

            <div className="card p-3 space-y-1.5 text-xs">
              <h4 className="font-semibold text-ink mb-1">Thông tin nhận đồ</h4>
              <p><span className="text-ink-3">Người nhận:</span> <strong className="text-ink">{previewOrder.receiverName}</strong> ({previewOrder.receiverPhone})</p>
              <p><span className="text-ink-3">Địa chỉ:</span> <span className="text-ink">{previewOrder.address || "Nhận tại quầy"}</span></p>
              <p><span className="text-ink-3">Phương thức:</span> <span className="text-ink">{previewOrder.paymentMethod === "vnpay" ? "Cổng VNPay" : "Thanh toán khi nhận đồ (COD)"}</span></p>
              {previewOrder.note && <p><span className="text-ink-3">Ghi chú:</span> <span className="text-ink italic">{previewOrder.note}</span></p>}
            </div>

            <div className="card divide-y divide-line">
              {previewOrder.items?.map((it, idx) => (
                <div key={idx} className="flex gap-3 p-3">
                  <img src={it.image} alt={it.productNameSnapshot} className="h-16 w-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{it.productNameSnapshot}</p>
                    <p className="text-[12px] text-ink-2">
                      Size: {it.variantSnapshot?.size} · Màu: {it.variantSnapshot?.color}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-accent">{formatVnd(it.lineRentalTotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-2">Tiền thuê:</span>
                <span className="font-medium">{formatVnd(previewOrder.subtotalRental)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-2">Tiền cọc giữ:</span>
                <span className="font-medium">{formatVnd(previewOrder.totalDeposit)}</span>
              </div>
              <div className="border-t border-line pt-2 flex justify-between font-bold">
                <span>Tổng đơn:</span>
                <span className="text-accent">{formatVnd(previewOrder.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Đã thanh toán:</span>
                <span>{formatVnd(previewOrder.paidAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
