"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { reviewService } from "@/services/reviewService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Overlay";
import { StatusChip, Stars } from "@/components/ui/Primitives";
import { IconCheck, IconEye, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/date";

export default function AdminReviewsPage() {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const data = await reviewService.getAdminReviews({
          status: statusFilter,
          rating: ratingFilter,
          search: search.trim() || undefined,
        });
        if (active) {
          setReviews(Array.isArray(data) ? data : []);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [statusFilter, ratingFilter]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await reviewService.getAdminReviews({
        status: statusFilter,
        rating: ratingFilter,
        search: search.trim() || undefined,
      });
      setReviews(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await reviewService.updateReviewStatus(id, newStatus);
      toast.push({
        tone: "success",
        title: newStatus === "approved" ? "Đã duyệt đánh giá" : newStatus === "hidden" ? "Đã ẩn đánh giá" : "Đã chuyển về chờ duyệt",
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedReview?.id === id) {
        setSelectedReview((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể cập nhật trạng thái.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này khỏi hệ thống?")) return;
    try {
      await reviewService.deleteReview(id);
      toast.push({ tone: "success", title: "Xóa đánh giá thành công." });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      if (selectedReview?.id === id) {
        setSelectedReview(null);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể xóa đánh giá.";
      toast.push({ tone: "danger", title: msg });
    }
  };

  const pendingCount = useMemo(
    () => reviews.filter((r) => r.status === "pending").length,
    [reviews]
  );

  const columns = [
    {
      key: "product_name",
      header: "Sản phẩm",
      render: (r) => (
        <div className="max-w-[200px]">
          <p className="font-medium text-ink truncate">{r.product_name || "Sản phẩm #" + r.product_id}</p>
          <span className="text-[11px] text-ink-3">ID: #{r.product_id}</span>
        </div>
      ),
    },
    {
      key: "author",
      header: "Khách hàng",
      render: (r) => (
        <div>
          <p className="font-medium text-ink">{r.author || "Khách hàng"}</p>
          {(r.size_worn || r.sizeWorn || r.height_cm || r.heightCm) && (
            <p className="text-[11px] text-ink-3">
              {[
                (r.size_worn || r.sizeWorn) ? `Size: ${r.size_worn || r.sizeWorn}` : null,
                (r.height_cm || r.heightCm) ? `${r.height_cm || r.heightCm}cm` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      header: "Số sao",
      sortValue: (r) => r.rating,
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Stars rating={r.rating} />
          <span className="text-xs font-semibold text-ink">{r.rating}★</span>
        </div>
      ),
    },
    {
      key: "content",
      header: "Nội dung",
      render: (r) => (
        <div className="max-w-[320px]">
          <p className="text-xs text-ink-2 line-clamp-2 leading-relaxed">{r.content}</p>
          <span className="text-[11px] text-ink-3">{formatDate(r.created_at || r.createdAt)}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (r) => {
        const toneMap = {
          approved: "positive",
          pending: "warning",
          hidden: "neutral",
        };
        const labelMap = {
          approved: "Đã duyệt",
          pending: "Chờ duyệt",
          hidden: "Đã ẩn",
        };
        return (
          <StatusChip tone={toneMap[r.status] || "neutral"}>
            {labelMap[r.status] || r.status}
          </StatusChip>
        );
      },
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          {r.status !== "approved" && (
            <button
              type="button"
              onClick={() => handleUpdateStatus(r.id, "approved")}
              disabled={updatingId === r.id}
              className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
              title="Duyệt hiển thị"
            >
              <IconCheck width={13} height={13} />
              <span>Duyệt</span>
            </button>
          )}

          {r.status === "approved" && (
            <button
              type="button"
              onClick={() => handleUpdateStatus(r.id, "hidden")}
              disabled={updatingId === r.id}
              className="inline-flex items-center gap-1 rounded bg-line/60 px-2.5 py-1 text-xs font-medium text-ink-2 hover:bg-line hover:text-ink transition-colors disabled:opacity-50"
              title="Ẩn đánh giá"
            >
              <span>Ẩn</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setSelectedReview(r)}
            className="p-1 text-ink-3 hover:text-ink transition-colors"
            title="Xem chi tiết"
          >
            <IconEye width={15} height={15} />
          </button>

          <button
            type="button"
            onClick={() => handleDelete(r.id)}
            className="p-1 text-ink-3 hover:text-danger transition-colors"
            title="Xóa đánh giá"
          >
            <IconTrash width={15} height={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý đánh giá"
        description="Kiểm duyệt và phản hồi các đánh giá từ khách hàng sau khi trải nghiệm sản phẩm."
        action={
          pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              {pendingCount} đánh giá chờ duyệt
            </span>
          )
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo khách hàng, nội dung hoặc sản phẩm..."
            className="w-full rounded border border-line bg-canvas px-3 py-1.5 text-xs text-ink outline-none focus:border-accent"
          />
          <button type="submit" className="btn btn-outline btn-sm text-xs shrink-0">
            Tìm
          </button>
        </form>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-line bg-canvas px-3 py-1.5 text-xs text-ink outline-none focus:border-accent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="hidden">Đã ẩn</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rounded border border-line bg-canvas px-3 py-1.5 text-xs text-ink outline-none focus:border-accent"
          >
            <option value="all">Tất cả số sao</option>
            <option value="5">5 sao ★★★★★</option>
            <option value="4">4 sao ★★★★☆</option>
            <option value="3">3 sao ★★★☆☆</option>
            <option value="2">2 sao ★★☆☆☆</option>
            <option value="1">1 sao ★☆☆☆☆</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={reviews}
        loading={loading}
        getKey={(r) => r.id}
        empty={<p className="p-8 text-center text-xs text-ink-3">Không có đánh giá nào phù hợp.</p>}
      />

      <Drawer
        open={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        title="Chi tiết đánh giá"
      >
        {selectedReview && (
          <div className="space-y-6">
            <div className="rounded-lg border border-line bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-3">Sản phẩm</span>
                <span className="text-xs font-semibold text-ink">
                  {selectedReview.product_name || "#" + selectedReview.product_id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-3">Người đánh giá</span>
                <span className="text-xs font-semibold text-ink">
                  {selectedReview.author || "Khách hàng"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-3">Điểm đánh giá</span>
                <div className="flex items-center gap-1.5">
                  <Stars rating={selectedReview.rating} />
                  <span className="text-xs font-bold text-ink">{selectedReview.rating} sao</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-3">Kích cỡ / Chiều cao</span>
                <span className="text-xs text-ink">
                  {[
                    (selectedReview.size_worn || selectedReview.sizeWorn) ? `Size ${selectedReview.size_worn || selectedReview.sizeWorn}` : null,
                    (selectedReview.height_cm || selectedReview.heightCm) ? `${selectedReview.height_cm || selectedReview.heightCm} cm` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Chưa cung cấp"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-3">Thời gian gửi</span>
                <span className="text-xs text-ink">
                  {formatDate(selectedReview.created_at || selectedReview.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-3">Trạng thái hiện tại</span>
                <StatusChip
                  tone={
                    selectedReview.status === "approved"
                      ? "positive"
                      : selectedReview.status === "pending"
                      ? "warning"
                      : "neutral"
                  }
                >
                  {selectedReview.status === "approved"
                    ? "Đã duyệt"
                    : selectedReview.status === "pending"
                    ? "Chờ duyệt"
                    : "Đã ẩn"}
                </StatusChip>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Nội dung đánh giá
              </label>
              <div className="rounded-lg border border-line bg-canvas p-4 text-xs text-ink leading-relaxed whitespace-pre-line">
                {selectedReview.content}
              </div>
            </div>

            <div className="border-t border-line pt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDelete(selectedReview.id)}
                className="btn btn-outline btn-sm text-danger hover:bg-danger/10 text-xs"
              >
                Xóa đánh giá
              </button>

              <div className="flex items-center gap-2">
                {selectedReview.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReview.id, "approved")}
                    disabled={updatingId === selectedReview.id}
                    className="btn btn-primary btn-sm text-xs"
                  >
                    Duyệt hiển thị
                  </button>
                )}

                {selectedReview.status !== "hidden" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReview.id, "hidden")}
                    disabled={updatingId === selectedReview.id}
                    className="btn btn-outline btn-sm text-xs"
                  >
                    Ẩn đánh giá
                  </button>
                )}

                {selectedReview.status !== "pending" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReview.id, "pending")}
                    disabled={updatingId === selectedReview.id}
                    className="btn btn-outline btn-sm text-xs"
                  >
                    Chờ duyệt
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
