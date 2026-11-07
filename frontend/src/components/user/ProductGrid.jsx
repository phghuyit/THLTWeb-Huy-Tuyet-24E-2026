"use client";

import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton, Reveal } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products = [],
  loading = false,
  columns = 4,
  skeletonCount = 8,
  className,
}) {
  const grid = cn(
    "grid gap-x-4 gap-y-12 sm:gap-x-5",
    "grid-cols-2 md:grid-cols-3",
    columns === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3",
    className,
  );

  if (loading) {
    return (
      <div className={grid}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={grid}>
      {products.map((product, i) => (
        <Reveal key={product.slug || product.id} as="div" delay={(i % 4) * 80}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}

export function ProductRail({ products = [] }) {
  return (
    <div className="no-scrollbar -mx-[clamp(1.25rem,4vw,4rem)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.25rem,4vw,4rem)] pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0">
      {products.map((product, i) => (
        <Reveal
          key={product.slug || product.id}
          as="div"
          delay={i * 70}
          className="w-[68vw] shrink-0 snap-start sm:w-[42vw] md:w-[32vw] lg:w-auto"
        >
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}

export default ProductGrid;
