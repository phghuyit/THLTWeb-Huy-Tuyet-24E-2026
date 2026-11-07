"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { productService } from "@/services/productService";
import { ImageGallery } from "./ImageGallery";
import { VariantSelector } from "./VariantSelector";
import { PricingTiers } from "@/components/rental/PricingTiers";
import { PriceBreakdown } from "@/components/rental/PriceBreakdown";
import { ReviewList } from "./ReviewList";
import { ProductRail } from "@/components/user/ProductGrid";
import {
  IconCalendar,
  IconHeart,
  IconShield,
  IconStore,
  IconTruck,
} from "@/components/ui/Icons";
import {
  Accordion,
  Chip,
  QuantityStepper,
  Stars,
} from "@/components/ui/Primitives";
import { useToast } from "@/components/ui/Toast";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useRentalDates } from "@/store/rentalDates";
import { useWishlist } from "@/store/wishlist";
import { useMounted } from "@/hooks";
import { formatVnd } from "@/lib/money";
import { rentalDays, todayISO, addDays, formatDate } from "@/lib/date";
import { buildQuote } from "@/lib/pricing";
import { OCCASIONS, CATEGORIES } from "@/data/catalog";
import { SHIPPING, STORE } from "@/lib/settings";
import { cn } from "@/lib/utils";

export function ProductDetail({ product }) {
  const router = useRouter();
  const mounted = useMounted();
  const toast = useToast();
  const cart = useCart();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const wishlist = useWishlist();
  const {
    pickupDate: globalPickup,
    returnDate: globalReturn,
    setRange,
  } = useRentalDates();

  const originalPrice = Number(product?.rental_price_per_day || 350000);
  const effectivePrice = Number(
    product?.is_sale && product?.sale_rental_price
      ? product.sale_rental_price
      : (product?.effective_price || originalPrice)
  );
  const isSale = Boolean(product?.is_sale && product?.sale_rental_price && product.sale_rental_price < originalPrice);
  const discountPercent = product?.discount_percent || (isSale ? Math.round((1 - effectivePrice / originalPrice) * 100) : 0);
  const depositAmount = Number(product?.deposit_price ?? product?.deposit ?? 500000);

  const rawSizes = Array.isArray(product?.sizes)
    ? product.sizes.map((s) => (typeof s === "object" ? s?.size : s)).filter(Boolean)
    : [];
  const initialSize = rawSizes[0] || "M";

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const color = selectedColor || product?.variants?.[0]?.color || "Tiêu chuẩn";
  const size = selectedSize || initialSize;
  const currentSizeObj = Array.isArray(product?.sizes)
    ? product.sizes.find((s) => (typeof s === "object" ? s?.size === size : s === size))
    : null;
  const currentSizeStock = currentSizeObj?.stock_quantity !== undefined
    ? Number(currentSizeObj.stock_quantity)
    : (product?.total_stock !== undefined ? Number(product.total_stock) : 10);
  const isCurrentOutOfStock = currentSizeStock <= 0;
  const [quantity, setQuantity] = useState(1);
  const [pickup, setPickup] = useState(globalPickup || todayISO());
  const [returnDate, setReturnDate] = useState(
    globalReturn || addDays(todayISO(), 3),
  );
  const [dateEditing, setDateEditing] = useState(false);

  const category = product?.category || CATEGORIES.find((c) => c.slug === (product?.category?.slug || product?.categorySlug));

  const variant = useMemo(() => {
    const matched = (product?.variants || []).find((v) => v.size === size && v.color === color);
    if (matched) return matched;
    return {
      id: `var-${product?.id || 1}`,
      size,
      color,
      pricePerDay: effectivePrice,
      depositAmount: depositAmount,
      extraDayPrice: effectivePrice,
      tiers: [
        {
          days: 3,
          price: Math.round(effectivePrice * 2.5),
          label: "Gói 3 ngày",
        },
        {
          days: 7,
          price: Math.round(effectivePrice * 4.2),
          label: "Gói 7 ngày",
        },
      ],
    };
  }, [product, size, color, effectivePrice, depositAmount]);

  const days = Math.max(1, rentalDays(pickup, returnDate));

  const quote = useMemo(() => {
    return buildQuote([{ variant, days, quantity }]);
  }, [variant, days, quantity]);

  const saved = wishlist.hydrated && wishlist.has(product?.slug);

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadRelated() {
      try {
        const allProducts = await productService.getProducts();
        if (cancelled) return;

        const currentId = product?.id;
        const currentSlug = product?.slug;
        const categoryId = product?.category_id || product?.category?.id;
        const categorySlug = product?.category?.slug || product?.categorySlug;
        const parentId = product?.category?.parent_id;

        const matched = (allProducts || []).filter((p) => {
          if (p.id === currentId || p.slug === currentSlug) return false;

          const pCatId = p.category_id || p.category?.id;
          const pCatSlug = p.category?.slug || p.categorySlug;
          const pParentId = p.category?.parent_id;

          if (categoryId && pCatId && String(categoryId) === String(pCatId))
            return true;
          if (categorySlug && pCatSlug && categorySlug === pCatSlug)
            return true;
          if (parentId && pParentId && parentId === pParentId) return true;

          return false;
        });

        setRelatedProducts(matched.slice(0, 4));
      } catch (err) {
        console.error("Lỗi tải sản phẩm cùng category:", err);
      }
    }

    loadRelated();
    return () => {
      cancelled = true;
    };
  }, [
    product?.id,
    product?.slug,
    product?.category_id,
    product?.category?.id,
    product?.category?.slug,
    product?.category?.parent_id,
    product?.categorySlug,
  ]);

  async function handleAddToCart(redirect = false) {
    if (isCurrentOutOfStock) {
      toast.push({
        tone: "danger",
        title: "Kích cỡ này đang tạm hết hàng",
        body: "Vui lòng chọn kích cỡ khác hoặc liên hệ bộ phận hỗ trợ.",
      });
      return;
    }
    if (!pickup || !returnDate) {
      toast.push({
        tone: "danger",
        title: "Vui lòng chọn ngày nhận và ngày trả đồ",
      });
      return;
    }

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setRange(pickup, returnDate);

    const matchingSize = Array.isArray(product?.sizes)
      ? product.sizes.find((s) => (typeof s === "object" ? s.size : s) === size)
      : null;
    const resolvedProductSizeId = matchingSize?.id || (typeof variant?.id === "number" ? variant.id : null);

    try {
      setIsAdding(true);
      await cart.addLine({
        productId: product?.id,
        productSlug: product.slug,
        productSizeId: resolvedProductSizeId,
        product_size_id: resolvedProductSizeId,
        name: product.name,
        image: product.thumbnail || (Array.isArray(product.images) && (product.images[0]?.image_url || product.images[0]?.src || product.images[0])) || product.image,
        thumbnail: product.thumbnail || (Array.isArray(product.images) && (product.images[0]?.image_url || product.images[0]?.src || product.images[0])),
        brandLine: product.brand?.name || product.brandLine || "StyleRent",
        size: variant.size,
        color: variant.color,
        pricePerDay: effectivePrice,
        depositAmount: depositAmount,
        product: product,
        variant: variant,
        variantId: variant.id,
        quantity,
        pickupDate: pickup,
        returnDate,
      });

      toast.push({
        tone: "success",
        title: "Đã thêm vào giỏ thuê",
        body: `${product.name} · ${color} · ${size}`,
        action: { label: "Xem giỏ thuê", href: "/cart" },
      });

      if (redirect) {
        router.push("/cart");
      }
    } catch (err) {
      toast.push({
        tone: "danger",
        title: "Không thể thêm vào giỏ",
        body: err?.response?.data?.message || "Vui lòng thử lại sau.",
      });
    } finally {
      setIsAdding(false);
    }
  }

  const accordionItems = [
    {
      title: "Chính sách cọc & hoàn tiền",
      content: (
        <div className="space-y-2">
          <p>
            • Cọc giữ đồ được hoàn lại 100% khi khách trả trang phục nguyên vẹn.
          </p>
          <p>
            • Quy trình kiểm tra và hoàn tiền chuyển khoản trong vòng 24 giờ sau
            khi nhận lại đồ.
          </p>
          <p>• Miễn phí vệ sinh vết bẩn nhẹ thông thường.</p>
        </div>
      ),
    },
    {
      title: "Giao nhận & Thử đồ",
      content: (
        <div className="space-y-2">
          <p>
            • Hỗ trợ giao nhận 2 chiều tận nơi tại TP. Hồ Chí Minh và các tỉnh
            lân cận.
          </p>
          <p>
            • Khách có thể ghé trực tiếp showroom để thử đồ và chỉnh sửa nhẹ vừa
            dáng miễn phí.
          </p>
          <p>
            • Đồ được giao trước ngày sự kiện ít nhất 1 buổi để bạn chuẩn bị chu
            đáo.
          </p>
        </div>
      ),
    },
    {
      title: "Giặt hấp & Khử khuẩn",
      content: (
        <p>
          Tất cả trang phục đều trải qua quy trình giặt hấp chuyên nghiệp, ủi
          phẳng và bọc màng bảo vệ trước khi bàn giao tới bạn.
        </p>
      ),
    },
  ];

  return (
    <div>
      <nav className="shell py-6 text-[12px] text-ink-2">
        <Link href="/" className="link-line link-underline-in">
          Trang chủ
        </Link>
        <span className="mx-2 text-ink-3">/</span>
        <Link
          href={`/products?category=${product.categorySlug}`}
          className="link-line link-underline-in"
        >
          {category?.name || "Bộ sưu tập"}
        </Link>
        <span className="mx-2 text-ink-3">/</span>
        <span className="text-ink-3">{product?.name}</span>
      </nav>

      <div className="shell grid gap-10 pb-16 lg:grid-cols-[1.15fr_minmax(380px,0.85fr)] lg:gap-16">
        <div className="min-w-0">
          <ImageGallery images={product?.images} thumbnail={product?.thumbnail} name={product?.name} />
        </div>

        <div className="min-w-0 lg:sticky lg:top-[100px] lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            {product?.isNew && <Chip tone="ink">Mới về</Chip>}
            {product?.occasions?.slice(0, 2).map((o) => (
              <Chip key={o}>
                {OCCASIONS.find((x) => x.slug === o)?.name || o}
              </Chip>
            ))}
          </div>

          <p className="eyebrow mt-5 text-ink-3">
            {product?.brandLine || product?.brand?.name || "StyleRent"}
          </p>
          <h1 className="display-2 mt-2">{product?.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Stars value={product?.rating || 5} size={14} />
            <span className="text-[12.5px] text-ink-2">
              {product?.rating
                ? product.rating.toFixed(1).replace(".", ",")
                : "5,0"}{" "}
              ({product?.reviewCount || 18} đánh giá)
            </span>
            <span className="text-[12.5px] text-ink-3">
              · đã thuê {product?.rentalCount || 65} lượt
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-[26px] text-ink">
              {formatVnd(variant.pricePerDay)}
            </span>
            {isSale && (
              <span className="text-[16px] text-ink-3 line-through">
                {formatVnd(originalPrice)}
              </span>
            )}
            <span className="text-[14px] text-ink-2">/ ngày</span>
            {isSale && (
              <span className="rounded bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                -{discountPercent}%
              </span>
            )}
          </div>
          <p className="mt-1.5 text-[13px] text-ink-2">
            Cọc {formatVnd(variant.depositAmount)} — hoàn lại khi trả nguyên vẹn
          </p>

          <p className="mt-5 max-w-[54ch] text-[13.5px] leading-relaxed text-ink-2">
            {product?.description}
          </p>

          <div className="mt-8 space-y-6">
            <div className="border border-ink">
              <button
                type="button"
                onClick={() => setDateEditing((v) => !v)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-warm"
              >
                <span className="flex items-center gap-3">
                  <IconCalendar className="shrink-0 text-ink-2" />
                  <span>
                    <span className="eyebrow block text-ink-3">Ngày thuê</span>
                    <span className="mt-1 block text-[14px]">
                      {pickup && returnDate ? (
                        <>
                          {formatDate(pickup)}{" "}
                          <span className="text-ink-3">→</span>{" "}
                          {formatDate(returnDate)}
                        </>
                      ) : (
                        "Chọn ngày nhận và ngày trả"
                      )}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-ink-2">
                  {dateEditing ? "Đóng" : "Đổi ngày"}
                </span>
              </button>

              {dateEditing && (
                <div className="border-t border-line bg-surface p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-ink-3 uppercase">
                        Ngày nhận
                      </label>
                      <input
                        type="date"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="field mt-1 text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-ink-3 uppercase">
                        Ngày trả
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="field mt-1 text-[13px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-line bg-warm px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[13px]">{days} ngày thuê</span>
                  <span className="text-[15px] font-semibold tabular-nums">
                    {formatVnd(quote.subtotalRental)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="field-label mb-2">Gói thuê</p>
              <PricingTiers
                variant={variant}
                activeDays={days}
                onPick={(d) => setReturnDate(addDays(pickup, d))}
              />
            </div>

            <VariantSelector
              product={product}
              size={size}
              color={color}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="field-label mb-0">Số lượng</p>
                <span className={`text-xs ${isCurrentOutOfStock ? "text-rose-600 font-semibold" : "text-ink-3"}`}>
                  {isCurrentOutOfStock ? "Tạm hết hàng" : `Còn ${currentSizeStock} sản phẩm trong kho`}
                </span>
              </div>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={Math.max(1, currentSizeStock)}
                disabled={isCurrentOutOfStock}
              />
            </div>

            <PriceBreakdown quote={quote} />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={isAdding || isCurrentOutOfStock}
                onClick={() => handleAddToCart(false)}
                className="btn btn-outline flex-1 py-3 text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCurrentOutOfStock ? "Tạm hết hàng" : (isAdding ? "Đang xử lý..." : "Thêm vào giỏ thuê")}
              </button>
              <button
                type="button"
                disabled={isAdding || isCurrentOutOfStock}
                onClick={() => handleAddToCart(true)}
                className="btn flex-1 py-3 text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCurrentOutOfStock ? "Tạm hết hàng" : (isAdding ? "Đang xử lý..." : "Thuê ngay")}
              </button>
              <button
                type="button"
                aria-label="Yêu thích"
                onClick={() => wishlist.toggle(product.slug)}
                className={cn(
                  "grid h-12 w-12 place-items-center border border-line bg-surface transition-colors",
                  saved
                    ? "text-accent border-accent"
                    : "text-ink hover:border-ink",
                )}
              >
                <IconHeart width={18} height={18} filled={saved} />
              </button>
            </div>
          </div>

          <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-[12.5px] text-ink-2">
            <li className="flex items-start gap-2.5">
              <IconStore width={15} height={15} className="mt-0.5 shrink-0" />
              Nhận tại cửa hàng miễn phí — {STORE.address}
            </li>
            <li className="flex items-start gap-2.5">
              <IconTruck width={15} height={15} className="mt-0.5 shrink-0" />
              Giao tận nơi 2 chiều {formatVnd(SHIPPING.round_trip_fee)} · miễn
              phí cho đơn thuê từ {formatVnd(SHIPPING.free_shipping_threshold)}
            </li>
            <li className="flex items-start gap-2.5">
              <IconShield width={15} height={15} className="mt-0.5 shrink-0" />
              Đã giặt hấp và kiểm tra trước khi bàn giao
            </li>
          </ul>

          <div className="mt-8 border-t border-line pt-6">
            <Accordion items={accordionItems} />
          </div>
        </div>
      </div>

      <div className="shell mt-20 border-t border-line pt-16">
        <ReviewList productId={product?.id} productSlug={product?.slug} rating={product?.rating || 5} reviewCount={product?.reviewCount} />
      </div>

      {relatedProducts.length > 0 && (
        <section className="shell mt-20 border-t border-line pt-16">
          <div className="flex items-end justify-between pb-8">
            <div>
              <p className="eyebrow text-ink-3">Gợi ý cho bạn</p>
              <h2 className="display-3 mt-1.5">Sản phẩm tương tự</h2>
            </div>
            <Link
              href={`/products?category=${product?.category?.slug || product?.categorySlug || product?.category_id || ""}`}
              className="link-line link-underline-in text-[11.5px] uppercase tracking-[0.14em] text-ink-2 hover:text-ink"
            >
              Xem tất cả
            </Link>
          </div>
          <ProductRail products={relatedProducts} />
        </section>
      )}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md p-6 shadow-2xl relative bg-surface border border-line">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute right-4 top-4 text-ink-3 hover:text-ink text-base font-bold p-1"
              aria-label="Đóng"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">Yêu cầu đăng nhập</h3>
                <p className="text-xs text-ink-2">Bạn cần đăng nhập tài khoản để lưu trang phục vào giỏ và đặt thuê.</p>
              </div>
            </div>

            <div className="mb-5 flex gap-3 rounded-lg border border-line bg-warm/50 p-3 text-xs">
              <img
                src={product.thumbnail || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=120&q=80"}
                alt={product.name}
                className="h-14 w-12 rounded object-cover border border-line"
              />
              <div className="flex flex-col justify-center min-w-0">
                <p className="font-semibold text-ink truncate">{product.name}</p>
                <p className="text-ink-2 mt-0.5">Size: <strong className="text-ink">{size}</strong> · Màu: <strong className="text-ink">{color}</strong> · SL: <strong className="text-ink">{quantity}</strong></p>
                <p className="text-ink-3 mt-0.5">{formatDate(pickup)} → {formatDate(returnDate)} ({days} ngày)</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(`/products/${product.slug}`)}`)}
                className="btn btn-block py-2.5"
              >
                Đăng nhập ngay
              </button>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="btn btn-outline btn-block py-2.5 text-xs"
              >
                Để sau / Tiếp tục xem
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-ink-2">
              Chưa có tài khoản?{" "}
              <Link
                href={`/register?redirect=${encodeURIComponent(`/products/${product.slug}`)}`}
                className="font-semibold text-accent hover:underline"
              >
                Đăng ký thành viên
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
