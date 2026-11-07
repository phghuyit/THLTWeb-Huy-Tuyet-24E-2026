"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ProductMedia } from "@/components/user/ProductMedia";
import { IconBag, IconTrash, IconArrowRight, IconShield, IconTruck } from "@/components/ui/Icons";
import { EmptyState, Note, QuantityStepper, Reveal } from "@/components/ui/Primitives";
import { PriceBreakdown } from "@/components/rental/PriceBreakdown";
import { useToast } from "@/components/ui/Toast";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useMounted } from "@/hooks";
import { formatDate } from "@/lib/date";
import { formatVnd } from "@/lib/money";

export default function CartPage() {
  const mounted = useMounted();
  const { user } = useAuth();
  const cart = useCart();
  const toast = useToast();
  const [checkoutModal, setCheckoutModal] = useState(false);

  const readyItems = cart.items.filter((item) => {
    if (item.is_in_stock !== undefined) return Boolean(item.is_in_stock);
    if (item.stock_available !== undefined) return item.stock_available >= item.quantity && item.stock_available > 0;
    return true;
  });

  const waitlistItems = cart.items.filter((item) => {
    if (item.is_in_stock !== undefined) return !item.is_in_stock;
    if (item.stock_available !== undefined) return item.stock_available < item.quantity || item.stock_available <= 0;
    return false;
  });

  const checkoutQuote = useMemo(() => {
    const subtotalRental = readyItems.reduce((sum, it) => sum + (it.rental_total || 0), 0);
    const totalDeposit = readyItems.reduce((sum, it) => sum + (it.deposit_total || 0), 0);
    const grandTotal = subtotalRental + totalDeposit;
    return {
      subtotalRental,
      totalDeposit,
      grandTotal,
      dueNow: grandTotal,
      discount: 0,
      discountLabel: null,
      shippingFee: 0,
      shippingWaived: false,
      fullPaymentDiscount: 0,
    };
  }, [readyItems]);

  if (mounted && !user) {
    return (
      <div className="shell py-16 md:py-24">
        <h1 className="display-2 mb-8">Giỏ thuê của bạn</h1>
        <EmptyState
          icon={<IconBag width={36} height={36} />}
          title="Bạn chưa đăng nhập"
          body="Vui lòng đăng nhập tài khoản của bạn để xem và quản lý danh sách trang phục trong giỏ thuê."
          action={
            <Link href="/login?redirect=/cart" className="btn mt-4">
              Đăng nhập ngay
            </Link>
          }
        />
      </div>
    );
  }

  if (mounted && cart.items.length === 0) {
    return (
      <div className="shell py-16 md:py-24">
        <h1 className="display-2 mb-8">Giỏ thuê của bạn</h1>
        <EmptyState
          icon={<IconBag width={36} height={36} />}
          title="Giỏ thuê đang trống"
          body="Chọn khoảng ngày bạn cần, các món đồ rảnh sẽ sẵn sàng cho bạn đặt thuê. Mỗi món thêm vào giỏ được giữ chỗ đảm bảo."
          action={
            <Link href="/products" className="btn mt-4">
              Khám phá bộ sưu tập
            </Link>
          }
        />
      </div>
    );
  }

  function handleCheckout() {
    setCheckoutModal(true);
  }

  return (
    <div className="shell pb-24 pt-10 md:pt-14">
      <Reveal className="mb-10">
        <p className="eyebrow text-ink-3">Bước 1 / 2</p>
        <h1 className="display-2 mt-2">Giỏ thuê của bạn</h1>
        <p className="mt-2 text-[14px] text-ink-2">
          Đang có {cart.count} sản phẩm trong giỏ thuê.
        </p>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] xl:gap-16">
        <div>
          {readyItems.length > 0 ? (
            <ul className="divide-y divide-line border-y border-line">
              {readyItems.map((item) => (
                <li key={item.id} className="py-6 sm:py-8">
                  <div className="flex gap-4 sm:gap-6">
                    <Link href={`/products/${item.slug}`} className="w-24 shrink-0 sm:w-28">
                      <ProductMedia image={item.thumbnail} ratio="3/4" />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="eyebrow text-ink-3">StyleRent</p>
                            <h3 className="mt-1 text-[15px] font-medium leading-snug">
                              <Link href={`/products/${item.slug}`} className="hover:underline">
                                {item.name}
                              </Link>
                            </h3>
                          </div>

                          <button
                            type="button"
                            aria-label="Xoá khỏi giỏ"
                            onClick={() => {
                              cart.removeLine(item.id);
                              toast.push({ tone: "neutral", title: "Đã xoá món đồ khỏi giỏ" });
                            }}
                            className="p-1.5 text-ink-3 hover:text-danger"
                          >
                            <IconTrash width={16} height={16} />
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-2">
                          <span>Màu: <strong className="text-ink">{item.color || "Tiêu chuẩn"}</strong></span>
                          <span>Size: <strong className="text-ink">{item.size || "FreeSize"}</strong></span>
                          <span>Thời gian: <strong className="text-ink">{item.days} ngày</strong> ({formatDate(item.pickup_date)} → {formatDate(item.return_date)})</span>
                          {item.stock_available !== undefined && (
                            <span className="text-[11.5px] text-emerald-700 bg-emerald-50 px-1.5 rounded">
                              Kho sẵn có: {item.stock_available}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-line-2">
                        <QuantityStepper
                          value={item.quantity}
                          compact
                          max={item.stock_available ? Math.max(1, item.stock_available) : 99}
                          onChange={(qty) => cart.updateLine(item.id, { quantity: qty })}
                        />

                        <div className="text-right">
                          <p className="text-[15px] font-semibold text-ink">{formatVnd(item.rental_total)}</p>
                          <p className="text-[11.5px] text-ink-3">Cọc {formatVnd(item.deposit_total)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-line bg-surface p-8 text-center text-xs text-ink-3">
              Không có sản phẩm nào sẵn sàng giao ngay. Các sản phẩm của bạn đang nằm trong danh sách chờ bên dưới do tạm hết hàng.
            </div>
          )}

          {waitlistItems.length > 0 && (
            <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50/40 p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-800 text-[11px] font-bold">
                    !
                  </span>
                  <h3 className="text-xs sm:text-sm font-semibold text-ink">
                    Danh sách chờ / Tạm hết hàng ({waitlistItems.length})
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-0.5">
                  Tạm hết hàng
                </span>
              </div>

              <p className="text-[11.5px] text-ink-3 leading-relaxed">
                Những món đồ dưới đây hiện không đủ số lượng trong kho nên đã được chuyển vào danh sách chờ và không tính vào hóa đơn thanh toán.
              </p>

              <ul className="divide-y divide-line/60 border-t border-line/60">
                {waitlistItems.map((item) => (
                  <li key={item.id} className="py-4 opacity-60 transition-opacity hover:opacity-100">
                    <div className="flex gap-4 sm:gap-5 items-center">
                      <Link href={`/products/${item.slug}`} className="w-16 shrink-0 sm:w-20">
                        <ProductMedia image={item.thumbnail} ratio="3/4" />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                                Tạm hết hàng
                              </span>
                              <span className="text-[11px] text-ink-3">
                                Kho hiện còn: <strong className="text-ink">{item.stock_available ?? 0} cái</strong>
                              </span>
                            </div>
                            <h4 className="mt-1 text-xs sm:text-sm font-medium text-ink">
                              <Link href={`/products/${item.slug}`} className="hover:underline">
                                {item.name}
                              </Link>
                            </h4>
                            <div className="mt-1 flex flex-wrap gap-x-3 text-[11.5px] text-ink-3">
                              <span>Size: <strong>{item.size || "FreeSize"}</strong></span>
                              <span>SL muốn thuê: <strong>{item.quantity}</strong></span>
                              <span>Thuê: {formatVnd(item.rental_total)}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            aria-label="Xoá khỏi danh sách chờ"
                            onClick={() => {
                              cart.removeLine(item.id);
                              toast.push({ tone: "neutral", title: "Đã xóa khỏi danh sách chờ" });
                            }}
                            className="p-1.5 text-ink-3 hover:text-danger"
                            title="Xóa món này khỏi giỏ"
                          >
                            <IconTrash width={15} height={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Link href="/products" className="btn btn-outline btn-sm">
              ← Tiếp tục xem đồ
            </Link>
            <button
              type="button"
              onClick={() => {
                cart.clear();
                toast.push({ tone: "neutral", title: "Đã làm trống giỏ hàng" });
              }}
              className="text-[12px] text-ink-3 hover:text-danger"
            >
              Xoá toàn bộ
            </button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="sticky top-28 rounded border border-line bg-surface p-6">
            <h2 className="text-[16px] font-medium">Tóm tắt thanh toán</h2>

            <PriceBreakdown quote={checkoutQuote} className="mt-5" />

            {readyItems.length > 0 ? (
              <Link
                href="/checkout"
                className="btn btn-block mt-6 py-3.5 text-[12px]"
              >
                Tiến hành đặt thuê ({formatVnd(checkoutQuote.dueNow)})
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="btn btn-block mt-6 py-3.5 text-[12px] opacity-50 cursor-not-allowed"
              >
                Chưa có đồ sẵn sàng ({formatVnd(0)})
              </button>
            )}

            <div className="mt-6 space-y-2.5 border-t border-line pt-4 text-[12px] text-ink-2">
              <p className="flex items-center gap-2">
                <IconShield width={14} height={14} className="text-accent shrink-0" />
                Cọc hoàn 100% khi trả lại trang phục nguyên vẹn
              </p>
              <p className="flex items-center gap-2">
                <IconTruck width={14} height={14} className="text-accent shrink-0" />
                Giao trước ngày sự kiện 1 buổi, miễn phí giặt hấp
              </p>
            </div>
          </div>
        </div>
      </div>

      {checkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded bg-surface p-6 shadow-xl animate-scale-in">
            <h3 className="text-lg font-bold text-ink">Xác nhận đơn đặt thuê</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
              Đơn thuê gồm {readyItems.length} sản phẩm với tổng tiền cần thanh toán trước là <strong>{formatVnd(checkoutQuote.dueNow)}</strong>.
            </p>
            <div className="mt-4 rounded bg-warm p-3 text-[12.5px] space-y-1">
              <div className="flex justify-between">
                <span>Tiền cọc:</span>
                <span className="font-semibold">{formatVnd(checkoutQuote.totalDeposit)}</span>
              </div>
              <div className="flex justify-between">
                <span>Trả trước 30% thuê:</span>
                <span className="font-semibold">{formatVnd(Math.round(checkoutQuote.subtotalRental * 0.3))}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCheckoutModal(false)}
                className="btn btn-outline btn-sm"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.push({ tone: "success", title: "Đặt thuê thành công!", body: "Chúng tôi sẽ liên hệ bạn để xác nhận lịch giao." });
                  cart.clear();
                  setCheckoutModal(false);
                }}
                className="btn btn-sm"
              >
                Xác nhận đặt thuê
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
