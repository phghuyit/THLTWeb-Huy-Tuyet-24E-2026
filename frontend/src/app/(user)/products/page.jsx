"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { brandService } from "@/services/brandService";
import { ProductGrid } from "@/components/user/ProductGrid";
import { Drawer } from "@/components/ui/Overlay";
import { EmptyState, ProductCardSkeleton, Reveal } from "@/components/ui/Primitives";
import { IconClose, IconFilter, IconSearch } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const PRICE_BANDS = [
  { key: "d1", label: "Dưới 250.000₫", min: 0, max: 250000 },
  { key: "d2", label: "250.000 – 400.000₫", min: 250000, max: 400000 },
  { key: "d3", label: "400.000 – 700.000₫", min: 400000, max: 700000 },
  { key: "d4", label: "Trên 700.000₫", min: 700000, max: Infinity },
];

const PAGE_SIZE = 8;

function ProductsContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceBands, setSelectedPriceBands] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodData, catData, brandData] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
          brandService.getBrands(),
        ]);
        setProducts(prodData || []);
        setCategories(catData || []);
        setBrands(brandData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (categoryParam && categoryParam !== "all") {
      setSelectedCategories([categoryParam]);
    }
    if (searchParam) {
      setSearchKeyword(searchParam);
    }
  }, [searchParams]);

  const toggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
    setVisibleCount(PAGE_SIZE);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceBands([]);
    setSearchKeyword("");
    setSortBy("default");
    setVisibleCount(PAGE_SIZE);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const price = Number(
        p.sale_rental_price && p.is_sale
          ? p.sale_rental_price
          : p.rental_price_per_day || p.pricePerDay || 0
      );

      if (selectedCategories.length > 0) {
        const pCatId = p.category_id || p.category?.id;
        const pCatSlug = p.category?.slug || p.categorySlug;
        const directParentId = p.category?.parent_id;

        const matchCategory = selectedCategories.some((key) => {
          const kStr = String(key).toLowerCase();

          if (pCatId && String(pCatId) === kStr) return true;
          if (pCatSlug && pCatSlug.toLowerCase() === kStr) return true;

          const selectedCat = categories.find(
            (c) => c.slug?.toLowerCase() === kStr || String(c.id) === kStr
          );

          if (selectedCat) {
            if (pCatId && pCatId === selectedCat.id) return true;
            if (pCatSlug && pCatSlug === selectedCat.slug) return true;
            if (directParentId && directParentId === selectedCat.id) return true;

            const childIds = categories
              .filter((c) => c.parent_id === selectedCat.id)
              .map((c) => c.id);
            if (childIds.includes(pCatId)) return true;
          }

          if (p.category?.name && p.category.name.toLowerCase().includes(kStr)) {
            return true;
          }

          return false;
        });

        if (!matchCategory) return false;
      }

      if (selectedBrands.length > 0) {
        const matchBrand = selectedBrands.some((brandKey) => {
          const kStr = String(brandKey).toLowerCase();
          const pBrandId = String(p.brand_id || p.brand?.id || "");
          const pBrandSlug = (p.brand?.slug || "").toLowerCase();
          const pBrandName = (p.brand?.name || p.brandLine || "").toLowerCase();

          return (
            pBrandId === kStr ||
            pBrandSlug === kStr ||
            pBrandName.includes(kStr)
          );
        });
        if (!matchBrand) return false;
      }

      if (selectedPriceBands.length > 0) {
        const matchPrice = selectedPriceBands.some((bandKey) => {
          const band = PRICE_BANDS.find((b) => b.key === bandKey);
          if (!band) return false;
          return price >= band.min && price < band.max;
        });
        if (!matchPrice) return false;
      }

      if (searchKeyword.trim()) {
        const term = searchKeyword.toLowerCase();
        const matchSearch =
          p.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.short_description?.toLowerCase().includes(term) ||
          p.sku?.toLowerCase().includes(term);
        if (!matchSearch) return false;
      }

      return true;
    });

    result = [...result];
    switch (sortBy) {
      case "moi-nhat":
        result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case "gia-tang":
        result.sort(
          (a, b) =>
            (a.rental_price_per_day || a.pricePerDay || 0) -
            (b.rental_price_per_day || b.pricePerDay || 0)
        );
        break;
      case "gia-giam":
        result.sort(
          (a, b) =>
            (b.rental_price_per_day || b.pricePerDay || 0) -
            (a.rental_price_per_day || a.pricePerDay || 0)
        );
        break;
      case "thue-nhieu":
        result.sort((a, b) => (b.rentalCount || 0) - (a.rentalCount || 0));
        break;
      case "danh-gia":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        result.sort(
          (a, b) =>
            Number(b.is_featured || b.isFeatured) -
              Number(a.is_featured || a.isFeatured) ||
            (b.rentalCount || 0) - (a.rentalCount || 0)
        );
    }

    return result;
  }, [
    products,
    categories,
    selectedCategories,
    selectedBrands,
    selectedPriceBands,
    searchKeyword,
    sortBy,
  ]);

  const activeFilters = [
    ...selectedCategories.map((catKey) => {
      const found = categories.find(
        (c) => c.slug === catKey || String(c.id) === String(catKey)
      );
      return {
        id: `cat-${catKey}`,
        label: found ? found.name : catKey,
        clear: () =>
          setSelectedCategories((prev) => prev.filter((x) => x !== catKey)),
      };
    }),
    ...selectedBrands.map((brandKey) => {
      const found = brands.find(
        (b) => b.slug === brandKey || String(b.id) === String(brandKey)
      );
      return {
        id: `brand-${brandKey}`,
        label: found ? found.name : brandKey,
        clear: () =>
          setSelectedBrands((prev) => prev.filter((x) => x !== brandKey)),
      };
    }),
    ...selectedPriceBands.map((bandKey) => {
      const band = PRICE_BANDS.find((b) => b.key === bandKey);
      return {
        id: `price-${bandKey}`,
        label: band ? band.label : bandKey,
        clear: () =>
          setSelectedPriceBands((prev) => prev.filter((x) => x !== bandKey)),
      };
    }),
    ...(searchKeyword.trim()
      ? [
          {
            id: "search",
            label: `"${searchKeyword.trim()}"`,
            clear: () => setSearchKeyword(""),
          },
        ]
      : []),
  ];

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3.5 text-ink-3">Danh mục</p>
        <ul className="space-y-2.5">
          {categories.map((c) => {
            const key = c.slug || String(c.id);
            const isChecked = selectedCategories.includes(key);
            return (
              <li key={key}>
                <label className="flex cursor-pointer items-center gap-2.5 text-[13px] hover:text-ink">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      toggleItem(selectedCategories, setSelectedCategories, key)
                    }
                    className="h-4 w-4 shrink-0 rounded accent-[#181818]"
                  />
                  <span className={isChecked ? "font-medium text-ink" : "text-ink-2"}>
                    {c.name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="eyebrow mb-3.5 text-ink-3">Thương hiệu</p>
        <ul className="space-y-2.5">
          {brands.map((b) => {
            const key = b.slug || String(b.id);
            const isChecked = selectedBrands.includes(key);
            return (
              <li key={key}>
                <label className="flex cursor-pointer items-center gap-2.5 text-[13px] hover:text-ink">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      toggleItem(selectedBrands, setSelectedBrands, key)
                    }
                    className="h-4 w-4 shrink-0 rounded accent-[#181818]"
                  />
                  <span className={isChecked ? "font-medium text-ink" : "text-ink-2"}>
                    {b.name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="eyebrow mb-3.5 text-ink-3">Giá thuê / ngày</p>
        <ul className="space-y-2.5">
          {PRICE_BANDS.map((band) => {
            const isChecked = selectedPriceBands.includes(band.key);
            return (
              <li key={band.key}>
                <label className="flex cursor-pointer items-center gap-2.5 text-[13px] hover:text-ink">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      toggleItem(
                        selectedPriceBands,
                        setSelectedPriceBands,
                        band.key
                      )
                    }
                    className="h-4 w-4 shrink-0 rounded accent-[#181818]"
                  />
                  <span className={isChecked ? "font-medium text-ink" : "text-ink-2"}>
                    {band.label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="link-line link-underline-in text-[11px] uppercase tracking-[0.12em] text-ink-2 hover:text-ink"
      >
        Đặt lại bộ lọc
      </button>

      <p className="border-t border-line pt-4 text-[11.5px] leading-relaxed text-ink-3">
        Giá hiển thị là giá thuê theo ngày, chưa gồm tiền cọc. Cọc từ 250.000₫ tuỳ món và luôn được hoàn lại khi trả đồ nguyên vẹn.
      </p>
    </div>
  );

  return (
    <div className="pt-[76px]">
      <header className="shell border-b border-line py-12 md:py-16">
        <Reveal>
          <nav className="eyebrow text-ink-3">
            <Link href="/" className="link-line link-underline-in">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span>Tủ đồ StyleRent</span>
          </nav>
          <h1 className="display-2 mt-5 max-w-[18ch]">Toàn bộ bộ sưu tập</h1>
          <p className="lede mt-5 max-w-[62ch]">
            Áo dài, dạ hội, váy cưới, vest, đồ biểu diễn và phụ kiện — tất cả đều cho thuê theo ngày, đã giặt hấp và kiểm tra trước khi đến tay bạn.
          </p>
        </Reveal>

        {categories.length > 0 && (
          <Reveal delay={120} className="no-scrollbar scroll-hint-x mt-8 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategories([])}
              className={cn(
                "shrink-0 border px-4 py-2 text-[12.5px] transition-colors",
                selectedCategories.length === 0
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface hover:border-ink text-ink"
              )}
            >
              Tất cả
            </button>
            {categories.map((c) => {
              const key = c.slug || String(c.id);
              const isActive = selectedCategories.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCategories([key])}
                  className={cn(
                    "shrink-0 border px-4 py-2 text-[12.5px] transition-colors",
                    isActive
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-surface hover:border-ink text-ink"
                  )}
                >
                  {c.name}
                </button>
              );
            })}
          </Reveal>
        )}
      </header>

      <div className="sticky top-[76px] z-20 border-b border-line bg-canvas/95 backdrop-blur-md">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3.5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="h-9 w-44 sm:w-64 rounded-sm border border-line bg-surface px-3 pl-8 pr-7 text-[12.5px] outline-none transition-colors hover:border-ink focus:border-ink text-ink placeholder:text-ink-3"
            />
            <IconSearch
              width={13}
              height={13}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-ink-3 hover:text-ink"
                aria-label="Xoá tìm kiếm"
              >
                <IconClose width={12} height={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-[12.5px] text-ink-2 sm:inline">
              {loading ? "Đang tải..." : `${filteredProducts.length} sản phẩm`}
            </span>

            <label className="sr-only" htmlFor="sort">
              Sắp xếp
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-line bg-surface px-3 py-2 text-[12.5px] outline-none transition-colors hover:border-ink text-ink cursor-pointer"
            >
              <option value="default">Gợi ý cho bạn</option>
              <option value="moi-nhat">Mới nhất</option>
              <option value="gia-tang">Giá thuê thấp → cao</option>
              <option value="gia-giam">Giá thuê cao → thấp</option>
              <option value="thue-nhieu">Được thuê nhiều</option>
              <option value="danh-gia">Đánh giá cao</option>
            </select>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="btn btn-quiet lg:hidden flex items-center gap-1.5"
            >
              <IconFilter width={13} height={13} />
              <span>Bộ lọc{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="shell grid gap-10 py-10 lg:grid-cols-[240px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-[146px] max-h-[calc(100vh-170px)] overflow-y-auto pr-2">
            {filterPanel}
          </div>
        </aside>

        <div>
          {activeFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {activeFilters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={f.clear}
                  className="inline-flex items-center gap-1.5 bg-warm px-3 py-1.5 text-[12px] text-ink transition-colors hover:bg-line"
                >
                  <span>{f.label}</span>
                  <IconClose width={12} height={12} className="text-ink-2" />
                </button>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="link-line link-underline-in ml-1 text-[11px] uppercase tracking-[0.12em] text-ink-2 hover:text-ink"
              >
                Xoá tất cả
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="Không có món nào khớp bộ lọc"
              body="Thử bỏ bớt một vài tiêu chí, xoá từ khoá tìm kiếm hoặc đặt lại bộ lọc để tìm được trang phục ưng ý."
              action={
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn btn-outline btn-sm"
                >
                  Xoá bộ lọc
                </button>
              }
            />
          ) : (
            <>
              <ProductGrid
                products={filteredProducts.slice(0, visibleCount)}
                columns={4}
              />

              {visibleCount < filteredProducts.length && (
                <div className="mt-16 flex flex-col items-center gap-4">
                  <p className="text-[12.5px] text-ink-2">
                    Đang xem {Math.min(visibleCount, filteredProducts.length)} / {filteredProducts.length} sản phẩm
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="btn btn-outline"
                  >
                    Xem thêm
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Drawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Bộ lọc sản phẩm"
        subtitle={`${filteredProducts.length} sản phẩm phù hợp`}
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-quiet flex-1"
            >
              Xoá lọc
            </button>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="btn flex-[2]"
            >
              Xem {filteredProducts.length} sản phẩm
            </button>
          </div>
        }
      >
        <div className="py-2">{filterPanel}</div>
      </Drawer>
    </div>
  );
}

function ProductsRoute() {
  const searchParams = useSearchParams();
  return <ProductsView key={searchParams.toString()} />;
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="shell pt-[140px]">
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
