"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Section, StatCard } from "@/components/ui/PageParts";
import { Dot, Meter } from "@/components/ui/Primitives";
import { OrderStatusChip } from "@/components/admin/Chips";
import {
  IconAlert,
  IconBox,
  IconClock,
  IconList,
  IconPlus,
  IconRotateCcw,
  IconStore,
  IconTag,
  IconTruck,
  IconUser,
} from "@/components/ui/Icons";
import { dashboardService } from "@/services/dashboardService";
import { formatVnd } from "@/lib/money";
import { formatDate } from "@/lib/date";
import { ORDER_STATUS } from "@/lib/order-status";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getDashboardData();
      if (res) {
        setData(res);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const c = data?.counters || {
    total_revenue: 0,
    monthly_revenue: 0,
    total_orders: 0,
    pending_orders: 0,
    active_rentals: 0,
    total_products: 0,
    total_users: 0,
    total_reviews: 0,
    pending_reviews: 0,
    total_posts: 0,
    total_categories: 0,
    total_brands: 0,
  };

  const distribution = data?.status_distribution || {};
  const recentOrders = data?.recent_orders || [];
  const topProducts = data?.top_products || [];
  const totalOrdersCount = Math.max(1, c.total_orders);

  const statusList = [
    "pending_payment",
    "confirmed",
    "ready",
    "in_use",
    "completed",
    "cancelled",
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bảng điều hành"
        description="Tổng quan vận hành và các chỉ số kinh doanh thực tế từ hệ thống."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              className="btn btn-outline btn-sm gap-1.5"
              title="Làm mới dữ liệu"
            >
              <IconRotateCcw width={13} height={13} />
              Làm mới
            </button>
            <Link href="/admin/orders" className="btn btn-sm">
              Xem tất cả đơn
            </Link>
          </div>
        }
      />

      {(c.pending_orders > 0 || c.pending_reviews > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {c.pending_orders > 0 && (
            <div className="card card-pad flex items-center justify-between gap-3 border-warning/40 bg-warning-soft/20">
              <div className="flex items-center gap-3">
                <span className="rounded bg-warning-soft p-1.5 text-warning">
                  <IconAlert width={16} height={16} />
                </span>
                <div>
                  <h3 className="text-[13px] font-semibold text-ink">
                    {c.pending_orders} đơn hàng cần xử lý
                  </h3>
                  <p className="text-[11.5px] text-ink-2">
                    Các đơn ở trạng thái chờ thanh toán hoặc cần xác nhận bàn giao.
                  </p>
                </div>
              </div>
              <Link href="/admin/orders" className="btn btn-outline btn-xs shrink-0">
                Xử lý ngay
              </Link>
            </div>
          )}

          {c.pending_reviews > 0 && (
            <div className="card card-pad flex items-center justify-between gap-3 border-accent/40 bg-accent-soft/20">
              <div className="flex items-center gap-3">
                <span className="rounded bg-accent-soft p-1.5 text-accent">
                  <IconClock width={16} height={16} />
                </span>
                <div>
                  <h3 className="text-[13px] font-semibold text-ink">
                    {c.pending_reviews} đánh giá chờ duyệt
                  </h3>
                  <p className="text-[11.5px] text-ink-2">
                    Khách hàng vừa gửi feedback trang phục cần admin phê duyệt.
                  </p>
                </div>
              </div>
              <Link href="/admin/reviews" className="btn btn-outline btn-xs shrink-0">
                Kiểm duyệt
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Doanh thu 30 ngày"
          value={formatVnd(c.monthly_revenue)}
          tone="success"
          sub="Đơn đã xác nhận/hoàn tất"
          href="/admin/orders"
        />
        <StatCard
          label="Tổng đơn hàng"
          value={c.total_orders}
          sub="Tất cả thời gian"
          icon={<IconTruck width={16} height={16} />}
          href="/admin/orders"
        />
        <StatCard
          label="Đơn cần xử lý"
          value={c.pending_orders}
          tone={c.pending_orders > 0 ? "warning" : "neutral"}
          sub="Chờ duyệt / cọc"
          icon={<IconAlert width={16} height={16} />}
          href="/admin/orders"
        />
        <StatCard
          label="Đang lưu hành"
          value={c.active_rentals}
          tone="info"
          sub="Đang ở chỗ khách"
          icon={<IconClock width={16} height={16} />}
          href="/admin/orders"
        />
        <StatCard
          label="Sản phẩm trong kho"
          value={c.total_products}
          sub="Mẫu mã trang phục"
          icon={<IconTag width={16} height={16} />}
          href="/admin/products"
        />
        <StatCard
          label="Khách hàng"
          value={c.total_users}
          sub="Tài khoản thành viên"
          icon={<IconUser width={16} height={16} />}
          href="/admin/users"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Đơn hàng gần đây"
          description="Các đơn thuê mới nhất được tạo trên hệ thống."
        >
          <div className="card overflow-hidden">
            {recentOrders.length === 0 ? (
              <p className="p-6 text-center text-xs text-ink-2">
                {loading ? "Đang tải đơn hàng..." : "Chưa có đơn hàng nào."}
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {recentOrders.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-3.5 text-[12.5px] hover:bg-surface-2 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div>
                        <Link
                          href="/admin/orders"
                          className="font-semibold text-ink hover:text-accent transition-colors"
                        >
                          {item.code}
                        </Link>
                        <p className="text-[11.5px] text-ink-2 truncate">
                          {item.receiverName} · {item.receiverPhone || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="font-semibold text-accent">
                          {formatVnd(item.grandTotal)}
                        </span>
                        <p className="text-[10.5px] text-ink-3">
                          {formatDate(item.createdAt?.slice(0, 10))}
                        </p>
                      </div>
                      <OrderStatusChip status={item.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        <Section
          title="Phân bố trạng thái đơn hàng"
          description="Tỷ lệ phân bố thực tế các đơn hàng trong hệ thống."
        >
          <div className="card card-pad space-y-3.5">
            {statusList.map((statusKey) => {
              const meta = ORDER_STATUS[statusKey] || {
                label: statusKey,
                tone: "neutral",
              };
              const count = distribution[statusKey] || 0;
              const percent = Math.round((count / totalOrdersCount) * 100);
              return (
                <div key={statusKey} className="flex items-center gap-3 text-[12.5px]">
                  <span className="flex w-36 items-center gap-2">
                    <Dot tone={meta.tone} />
                    <span className="truncate">{meta.label}</span>
                  </span>
                  <div className="flex-1">
                    <Meter value={percent} tone={meta.tone} />
                  </div>
                  <span className="w-12 text-right font-semibold text-ink">
                    {count} <span className="text-[10.5px] text-ink-3">({percent}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section
            title="Sản phẩm xem nhiều nhất"
            description="Các trang phục có lượt quan tâm cao nhất trong danh mục."
          >
            <div className="card overflow-hidden">
              {topProducts.length === 0 ? (
                <p className="p-6 text-center text-xs text-ink-2">
                  {loading ? "Đang tải sản phẩm..." : "Chưa có sản phẩm nào."}
                </p>
              ) : (
                <ul className="divide-y divide-line">
                  {topProducts.map((p, idx) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between p-3 text-[13px] hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-bold text-ink-3 w-5 text-center">{idx + 1}</span>
                        <img
                          src={
                            p.thumbnail ||
                            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=120&q=80"
                          }
                          alt={p.name}
                          className="h-10 w-10 rounded object-cover shrink-0 border border-line"
                        />
                        <div className="min-w-0">
                          <Link
                            href="/admin/products"
                            className="font-medium text-ink truncate block hover:text-accent transition-colors"
                          >
                            {p.name}
                          </Link>
                          <p className="text-[11.5px] text-ink-3 truncate">
                            {p.category?.name || "Trang phục"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 shrink-0">
                        <span className="text-[11.5px] text-ink-2">
                          {p.view_count || 0} lượt xem
                        </span>
                        <span className="font-semibold text-accent">
                          {formatVnd(p.rental_price_per_day || 0)}/ngày
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Section>
        </div>

        <div>
          <Section
            title="Thống kê hệ thống"
            description="Quy mô dữ liệu nội dung đang quản trị."
          >
            <div className="card card-pad space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2.5 text-[12.5px]">
                <span className="flex items-center gap-2 text-ink-2">
                  <IconList width={15} height={15} /> Danh mục sản phẩm
                </span>
                <span className="font-bold text-ink">{c.total_categories}</span>
              </div>
              <div className="flex items-center justify-between border-b border-line pb-2.5 text-[12.5px]">
                <span className="flex items-center gap-2 text-ink-2">
                  <IconBox width={15} height={15} /> Thương hiệu đối tác
                </span>
                <span className="font-bold text-ink">{c.total_brands}</span>
              </div>
              <div className="flex items-center justify-between border-b border-line pb-2.5 text-[12.5px]">
                <span className="flex items-center gap-2 text-ink-2">
                  <IconStore width={15} height={15} /> Bài viết tin tức
                </span>
                <span className="font-bold text-ink">{c.total_posts}</span>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="flex items-center gap-2 text-ink-2">
                  <IconUser width={15} height={15} /> Đánh giá sản phẩm
                </span>
                <span className="font-bold text-ink">{c.total_reviews}</span>
              </div>

              <div className="pt-3 border-t border-line">
                <Link
                  href="/admin/products"
                  className="btn btn-outline btn-sm w-full gap-1.5 justify-center"
                >
                  <IconPlus width={13} height={13} />
                  Quản lý kho sản phẩm
                </Link>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
