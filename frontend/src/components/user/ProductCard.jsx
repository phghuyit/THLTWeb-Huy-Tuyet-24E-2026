"use client";

import Link from "next/link";
import { useState } from "react";
import { formatVnd } from "@/lib/money";
import { ProductMedia } from "./ProductMedia";
import { Chip, Stars } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

export function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  if (!product) return null;

  const originalPrice = Number(product.rental_price_per_day ?? product.pricePerDay ?? 0);
  const salePrice = Number(product.sale_rental_price);
  const onSale = Boolean(product.is_sale) && salePrice > 0 && salePrice < originalPrice;
  const price = onSale ? salePrice : originalPrice;
  const discount = onSale ? Math.round((1 - salePrice / originalPrice) * 100) : 0;
  const deposit = product.deposit ?? (product.original_value != null && product.deposit_rate_percent != null
    ? Math.round(Number(product.original_value) * Number(product.deposit_rate_percent) / 100)
    : null);
  const primary = product.images?.[0]?.image_url || product.images?.[0] || product.thumbnail || product.image;
  const secondary = product.images?.[1]?.image_url || product.images?.[1] || primary;
  const brandName = product.brand?.name || product.brandLine || product.brand_name || "StyleRent";
  const totalStock = product.total_stock ?? (Array.isArray(product.sizes) ? product.sizes.reduce((sum, s) => sum + (s.stock_quantity ?? 0), 0) : null);
  const isOutOfStock = totalStock !== null && totalStock <= 0;

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug || product.id}`} className="block">
        <div className="relative overflow-hidden bg-warm">
          <ProductMedia image={primary} alt={product.name} ratio="3/4" />
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-luxe",
              hovered ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          >
            <ProductMedia image={secondary} alt={product.name} ratio="3/4" />
          </div>

          <div className="pointer-events-none absolute left-0 top-0 flex flex-col items-start gap-1.5 p-3">
            {isOutOfStock && <span className="rounded bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">Tạm hết hàng</span>}
            {!isOutOfStock && product.isNew && <Chip tone="ink">Mới về</Chip>}
            {!isOutOfStock && product.is_featured && <Chip tone="warning">Hot</Chip>}
            {!isOutOfStock && onSale && <Chip tone="danger">Giảm {discount}%</Chip>}
          </div>
        </div>
      </Link>

      <div className="pt-4 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5">
        <p className="eyebrow text-ink-3">{brandName}</p>
        <h3 className="mt-1.5 text-[14.5px] leading-snug truncate" title={product.name}>
          <Link href={`/products/${product.slug || product.id}`} className="link-line link-underline-in truncate block">
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[14px]">{formatVnd(price)}</span>
          <span className="text-[12px] text-ink-2">/ ngày</span>
          {onSale && <del className="text-[12px] text-ink-3">{formatVnd(originalPrice)}</del>}
          {deposit != null && <span className="text-[12px] text-ink-3">· cọc {formatVnd(deposit)}</span>}
        </div>

        {product.rating != null && product.reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <Stars value={Number(product.rating)} size={12} />
            <span className="text-[11.5px] text-ink-3">
              {Number(product.rating).toFixed(1).replace(".", ",")} · {product.reviewCount} đánh giá
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
