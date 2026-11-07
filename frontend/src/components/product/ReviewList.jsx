"use client";

import { useEffect, useState } from "react";
import { Reveal, Stars, StatusChip } from "@/components/ui/Primitives";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/store/auth";
import { formatDate } from "@/lib/date";
import { reviewService } from "@/services/reviewService";

export function ReviewList({
  productId,
  productSlug = "",
  rating = 5,
  reviewCount = 0,
}) {
  const toast = useToast();
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(3);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [sizeWorn, setSizeWorn] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      try {
        if (productId || productSlug) {
          const data = await reviewService.getReviews({
            product_id: productId,
            product_slug: productSlug,
          });
          if (active && Array.isArray(data)) {
            setReviews(data);
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      active = false;
    };
  }, [productId, productSlug]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!content.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập nội dung đánh giá!" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        product_id: productId,
        product_slug: productSlug,
        author_name: author.trim() || user?.fullname || user?.name || "Khách hàng",
        rating: Number(newRating),
        content: content.trim(),
        size_worn: sizeWorn.trim() || undefined,
        height_cm: heightCm ? Number(heightCm) : undefined,
      };

      const newReview = await reviewService.createReview(payload);

      setReviews((prev) => [
        {
          id: newReview.id || Date.now(),
          author: newReview.author || payload.author_name,
          rating: Number(newReview.rating) || payload.rating,
          content: newReview.content || payload.content,
          sizeWorn: newReview.sizeWorn || newReview.size_worn || payload.size_worn,
          heightCm: newReview.heightCm || newReview.height_cm || payload.height_cm,
          status: newReview.status || "pending",
          createdAt: newReview.createdAt || newReview.created_at || new Date().toISOString(),
        },
        ...prev,
      ]);

      setContent("");
      setSizeWorn("");
      setHeightCm("");
      setAuthor("");
      setIsFormOpen(false);

      toast.push({
        tone: "success",
        title: "Gửi đánh giá thành công!",
        description: "Đánh giá của bạn đã được ghi nhận trên hệ thống.",
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const totalReviews = reviews.length;
  const computedAverage =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / totalReviews
      : Number(rating) || 5;

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const matching = reviews.filter((r) => Math.round(Number(r.rating) || 5) === star);
    const count = matching.length;
    const ratio = totalReviews > 0 ? count / totalReviews : 0;
    return { stars: star, count, ratio };
  });

  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
      <Reveal>
        <div className="flex items-center justify-between">
          <h2 className="display-3">Đánh giá</h2>
        </div>

        <div className="mt-6 flex items-end gap-4">
          <span className="font-display text-[52px] leading-none text-ink">
            {computedAverage.toFixed(1).replace(".", ",")}
          </span>
          <div className="pb-1.5">
            <Stars value={computedAverage} size={15} />
            <p className="mt-1 text-[12.5px] text-ink-2">
              {totalReviews || reviewCount || 0} đánh giá thực tế
            </p>
          </div>
        </div>

        <ul className="mt-7 space-y-2.5">
          {breakdown.map((row) => (
            <li key={row.stars} className="flex items-center gap-3 text-[12px] text-ink-2">
              <span className="w-4 tabular-nums font-medium">{row.stars}★</span>
              <span className="h-1.5 flex-1 bg-line rounded-full overflow-hidden">
                <span
                  className="block h-full bg-ink transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.round(row.ratio * 100)}%` }}
                />
              </span>
              <span className="w-6 text-right tabular-nums text-ink-3">
                {row.count}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-7 border-t border-line pt-6">
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="btn btn-outline btn-block text-xs"
          >
            {isFormOpen ? "Đóng form đánh giá" : "Viết đánh giá của bạn"}
          </button>
          <p className="mt-3 text-[11.5px] text-ink-3 leading-relaxed">
            Đánh giá mới gửi sẽ ở trạng thái <strong className="text-warning">Chờ duyệt</strong> và được quản trị viên duyệt trước khi hiển thị công khai.
          </p>
        </div>
      </Reveal>

      <div className="min-w-0 space-y-8">
        {isFormOpen && (
          <form
            onSubmit={handleSubmitReview}
            className="bg-warm/50 border border-line p-6 rounded-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-base font-bold text-ink">
                Gửi cảm nhận về trang phục
              </h3>
              <StatusChip tone="warning" className="text-[11px] py-0.5 px-2">
                Sẽ hiển thị &quot;Chờ duyệt&quot;
              </StatusChip>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-2 mb-1.5">
                Mức độ hài lòng của bạn *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                    aria-label={`${star} sao`}
                  >
                    <span className={`text-xl ${star <= newRating ? "text-[#b28a47]" : "text-line"}`}>
                      ★
                    </span>
                  </button>
                ))}
                <span className="text-xs text-ink-2 ml-2 font-medium">
                  {newRating === 5 ? "Tuyệt vời (5/5)" : `${newRating}/5 sao`}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-ink-2 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={author || (user ? user.fullname || user.name || "" : "")}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="field py-1.5 text-xs w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-2 mb-1">
                  Size đã mặc (tuỳ chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: S, M, L"
                  value={sizeWorn}
                  onChange={(e) => setSizeWorn(e.target.value)}
                  className="field py-1.5 text-xs w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-2 mb-1">
                  Chiều cao cm (tuỳ chọn)
                </label>
                <input
                  type="number"
                  placeholder="Ví dụ: 162"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="field py-1.5 text-xs w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-2 mb-1">
                Nội dung đánh giá *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Chia sẻ cảm nhận về chất liệu vải, độ vừa vặn và dịch vụ..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="field py-2 text-xs w-full"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="btn btn-outline text-xs py-2 px-4"
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn text-xs py-2 px-5 disabled:opacity-60"
              >
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-xs text-ink-3">Đang tải danh sách đánh giá...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-warm/40 border border-line rounded-sm p-8 text-center">
            <p className="text-[14px] text-ink-2">
              Chưa có đánh giá nào cho thiết kế này. Hãy bấm &quot;Viết đánh giá của bạn&quot; để gửi cảm nhận đầu tiên!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-line border-t border-line">
            {reviews.slice(0, visible).map((rev) => {
              const isPending = rev.status === "pending";

              return (
                <article key={rev.id} className="py-7 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Stars value={Number(rev.rating) || 5} size={13} />
                      <span className="text-[14px] font-medium text-ink">
                        {rev.author || rev.author_name || "Khách hàng"}
                      </span>

                      {isPending ? (
                        <StatusChip
                          tone="warning"
                          className="text-[10.5px] py-0 px-2 tracking-wide font-normal"
                        >
                          Chờ duyệt
                        </StatusChip>
                      ) : (
                        <StatusChip
                          tone="success"
                          className="text-[10.5px] py-0 px-2 tracking-wide font-normal"
                        >
                          Đã duyệt
                        </StatusChip>
                      )}
                    </div>

                    {(rev.createdAt || rev.created_at) && (
                      <span className="text-[12px] text-ink-3">
                        {formatDate((rev.createdAt || rev.created_at).slice(0, 10))}
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-[12px] text-ink-3">
                    {(rev.sizeWorn || rev.size_worn) && `Đã thuê size ${rev.sizeWorn || rev.size_worn}`}
                    {(rev.heightCm || rev.height_cm) ? ` · cao ${rev.heightCm || rev.height_cm}cm` : ""}
                  </p>

                  <p className="mt-3 max-w-[68ch] text-[13.5px] leading-relaxed text-ink-2">
                    {rev.content}
                  </p>
                </article>
              );
            })}

            {visible < reviews.length && (
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + 3)}
                  className="btn btn-outline text-xs"
                >
                  Xem thêm đánh giá ({reviews.length - visible})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
