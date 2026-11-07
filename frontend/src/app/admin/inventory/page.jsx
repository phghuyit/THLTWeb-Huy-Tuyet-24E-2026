"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Overlay";
import { StatusChip } from "@/components/ui/Primitives";
import { useToast } from "@/components/ui/Toast";

function InventoryContent() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const queryProductId = searchParams.get("productId");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(queryProductId || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);

  const [activeProduct, setActiveProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [importForm, setImportForm] = useState({
    productId: "",
    size: "",
    quantity: 1,
    note: "",
  });

  const [exportForm, setExportForm] = useState({
    productId: "",
    size: "",
    quantity: 1,
    reason: "Hư hỏng trong quá trình thuê",
    note: "",
  });

  const [adjustSizes, setAdjustSizes] = useState([]);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([productService.getProducts(), categoryService.getCategories()]).then(
      ([prods, cats]) => {
        if (active) {
          setProducts(prods);
          setCategories(cats);
          setLoading(false);
        }
      }
    );
    return () => {
      active = false;
    };
  }, []);

  const getProductTotalStock = (p) => {
    if (typeof p.total_stock === "number") return p.total_stock;
    if (Array.isArray(p.sizes)) {
      return p.sizes.reduce((sum, s) => sum + (parseInt(s.stock_quantity, 10) || 0), 0);
    }
    return 0;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const nameMatch = p.name?.toLowerCase().includes(query);
        const skuMatch = String(p.id) === query || p.slug?.toLowerCase().includes(query);
        if (!nameMatch && !skuMatch) return false;
      }

      if (selectedCategory !== "all") {
        const catId = p.category_id || p.category?.id;
        const catSlug = p.category?.slug || p.categorySlug;
        if (String(catId) !== String(selectedCategory) && catSlug !== selectedCategory) {
          return false;
        }
      }

      const total = getProductTotalStock(p);
      if (stockFilter === "out_of_stock" && total > 0) return false;
      if (stockFilter === "low_stock" && (total <= 0 || total > 2)) return false;
      if (stockFilter === "in_stock" && total <= 2) return false;

      return true;
    });
  }, [products, search, selectedCategory, stockFilter]);

  const hasActiveFilters = search.trim() !== "" || selectedCategory !== "all" || stockFilter !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setStockFilter("all");
  };

  const openImportModal = (product = null) => {
    const targetProduct = product || products[0] || null;
    setActiveProduct(targetProduct);
    const firstSize = targetProduct?.sizes?.[0]?.size || "FreeSize";
    setImportForm({
      productId: targetProduct ? String(targetProduct.id) : "",
      size: firstSize,
      quantity: 1,
      note: "",
    });
    setImportModalOpen(true);
  };

  const openExportModal = (product = null) => {
    const targetProduct = product || products[0] || null;
    setActiveProduct(targetProduct);
    const availableSize = targetProduct?.sizes?.find((s) => (parseInt(s.stock_quantity, 10) || 0) > 0);
    const firstSize = availableSize?.size || targetProduct?.sizes?.[0]?.size || "FreeSize";
    setExportForm({
      productId: targetProduct ? String(targetProduct.id) : "",
      size: firstSize,
      quantity: 1,
      reason: "Hư hỏng trong quá trình thuê",
      note: "",
    });
    setExportModalOpen(true);
  };

  const openAdjustModal = (product) => {
    setActiveProduct(product);
    const standardSizes = ["S", "M", "L", "XL"];
    const existing = product.sizes || [];
    let initialSizes = existing.map((s) => ({
      size: s.size,
      stock_quantity: parseInt(s.stock_quantity, 10) || 0,
    }));

    if (initialSizes.length === 0) {
      initialSizes = standardSizes.map((sz) => ({ size: sz, stock_quantity: 0 }));
    }

    setAdjustSizes(initialSizes);
    setAdjustModalOpen(true);
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importForm.productId) {
      toast.push({ tone: "danger", title: "Vui lòng chọn sản phẩm cần nhập kho." });
      return;
    }
    if (!importForm.size) {
      toast.push({ tone: "danger", title: "Vui lòng chọn kích cỡ cần nhập." });
      return;
    }
    const qty = parseInt(importForm.quantity, 10);
    if (!qty || qty <= 0) {
      toast.push({ tone: "danger", title: "Số lượng nhập phải lớn hơn 0." });
      return;
    }

    setSubmitting(true);
    try {
      await productService.importStock(importForm.productId, {
        size: importForm.size,
        quantity: qty,
        note: importForm.note?.trim() || null,
      });
      toast.push({
        tone: "success",
        title: `Nhập kho thành công +${qty} cái (Size ${importForm.size})!`,
      });
      setImportModalOpen(false);
      await loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi nhập kho. Vui lòng thử lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportSubmit = async (e) => {
    e.preventDefault();
    if (!exportForm.productId) {
      toast.push({ tone: "danger", title: "Vui lòng chọn sản phẩm cần xuất kho." });
      return;
    }
    if (!exportForm.size) {
      toast.push({ tone: "danger", title: "Vui lòng chọn kích cỡ cần xuất." });
      return;
    }
    const qty = parseInt(exportForm.quantity, 10);
    if (!qty || qty <= 0) {
      toast.push({ tone: "danger", title: "Số lượng xuất phải lớn hơn 0." });
      return;
    }

    setSubmitting(true);
    try {
      await productService.exportStock(exportForm.productId, {
        size: exportForm.size,
        quantity: qty,
        reason: exportForm.reason,
        note: exportForm.note?.trim() || null,
      });
      toast.push({
        tone: "success",
        title: `Xuất kho thành công -${qty} cái (Size ${exportForm.size})!`,
      });
      setExportModalOpen(false);
      await loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi xuất kho. Vui lòng kiểm tra lại số lượng khả dụng.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!activeProduct) return;

    setSubmitting(true);
    try {
      const payload = adjustSizes.map((s) => ({
        size: s.size,
        stock_quantity: Math.max(0, parseInt(s.stock_quantity, 10) || 0),
      }));

      await productService.updateStock(activeProduct.id, payload);
      toast.push({
        tone: "success",
        title: `Cập nhật tồn kho thành công cho sản phẩm #${activeProduct.id}!`,
      });
      setAdjustModalOpen(false);
      await loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi cập nhật tồn kho.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "product",
      header: "Sản phẩm",
      sortValue: (p) => p.name,
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.thumbnail || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80"}
            alt={p.name}
            className="h-12 w-10 shrink-0 rounded object-cover border border-line bg-surface-2"
          />
          <div>
            <p className="font-semibold text-ink line-clamp-1">{p.name}</p>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-3">
              <span>Mã: #{p.id}</span>
              <span>·</span>
              <span>{p.category?.name || p.categorySlug || "Áo dài"}</span>
              {p.brand?.name && (
                <>
                  <span>·</span>
                  <span>{p.brand.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "stock_breakdown",
      header: "Số lượng theo Size",
      render: (p) => {
        const sizes = p.sizes || [];
        if (sizes.length === 0) {
          return <span className="text-xs text-ink-3">Chưa cấu hình size</span>;
        }
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {sizes.map((s) => {
              const qty = parseInt(s.stock_quantity, 10) || 0;
              return (
                <span
                  key={s.size}
                  className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium ${
                    qty > 2
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : qty > 0
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-rose-200 bg-rose-50 text-rose-800"
                  }`}
                >
                  <span className="font-semibold">{s.size}:</span>
                  <span>{qty}</span>
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      key: "total_stock",
      header: "Tổng tồn kho",
      align: "center",
      sortValue: (p) => getProductTotalStock(p),
      render: (p) => {
        const total = getProductTotalStock(p);
        let tone = "success";
        let label = "Còn hàng";
        if (total === 0) {
          tone = "danger";
          label = "Hết hàng";
        } else if (total <= 2) {
          tone = "warning";
          label = "Sắp hết";
        }

        return (
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-ink">{total} cái</span>
            <div className="mt-1">
              <StatusChip tone={tone}>{label}</StatusChip>
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Thao tác kho",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => openImportModal(p)}
            className="btn btn-outline btn-xs gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            title="Nhập thêm hàng vào kho"
          >
            + Nhập
          </button>
          <button
            type="button"
            onClick={() => openExportModal(p)}
            className="btn btn-outline btn-xs gap-1 border-rose-300 text-rose-700 hover:bg-rose-50"
            title="Xuất bớt hàng khỏi kho"
          >
            - Xuất
          </button>
          <button
            type="button"
            onClick={() => openAdjustModal(p)}
            className="btn btn-sm btn-outline btn-xs"
            title="Điều chỉnh trực tiếp số lượng từng size"
          >
            Sửa tồn
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý tồn kho"
        description="Kiểm soát số lượng trang phục sẵn sàng cho thuê, thực hiện nhập và xuất kho theo kích cỡ."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openImportModal(null)}
              className="btn btn-sm gap-1.5 bg-emerald-700 text-white hover:bg-emerald-800"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Nhập kho (Import)
            </button>
            <button
              type="button"
              onClick={() => openExportModal(null)}
              className="btn btn-sm gap-1.5 bg-rose-700 text-white hover:bg-rose-800"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
              </svg>
              Xuất kho (Export)
            </button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3 text-xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, mã ID, slug..."
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="field h-9 text-xs min-w-[150px]"
            aria-label="Lọc theo danh mục"
          >
            <option value="all">Tất cả danh mục ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="field h-9 text-xs min-w-[140px]"
            aria-label="Lọc theo tình trạng tồn kho"
          >
            <option value="all">Tất cả tình trạng kho</option>
            <option value="in_stock">Còn nhiều hàng (&gt; 2)</option>
            <option value="low_stock">Sắp hết hàng (1-2)</option>
            <option value="out_of_stock">Hết hàng (0)</option>
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
          Hiển thị <span className="font-semibold text-ink">{filteredProducts.length}</span> sản phẩm
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredProducts}
        getKey={(p) => p.id}
        loading={loading}
      />

      <Modal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Nhập kho sản phẩm (Import Stock)"
        description="Ghi nhận số lượng sản phẩm nhập thêm vào kho lưu trữ."
        width="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setImportModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="import-stock-form"
              disabled={submitting}
              className="btn btn-sm bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận nhập kho"}
            </button>
          </div>
        }
      >
        <form id="import-stock-form" onSubmit={handleImportSubmit} className="space-y-4 text-xs">
          <div>
            <label className="field-label">Chọn sản phẩm nhập *</label>
            <select
              value={importForm.productId}
              onChange={(e) => {
                const prod = products.find((p) => String(p.id) === e.target.value);
                setActiveProduct(prod || null);
                const firstSz = prod?.sizes?.[0]?.size || "FreeSize";
                setImportForm({
                  ...importForm,
                  productId: e.target.value,
                  size: firstSz,
                });
              }}
              className="field"
              required
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} · {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Kích cỡ *</label>
              <select
                value={importForm.size}
                onChange={(e) => setImportForm({ ...importForm, size: e.target.value })}
                className="field"
                required
              >
                {activeProduct?.sizes?.length ? (
                  activeProduct.sizes.map((s) => (
                    <option key={s.size} value={s.size}>
                      Size {s.size} (Hiện có: {s.stock_quantity ?? 0})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="FreeSize">Size FreeSize</option>
                    <option value="S">Size S</option>
                    <option value="M">Size M</option>
                    <option value="L">Size L</option>
                    <option value="XL">Size XL</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="field-label">Số lượng nhập thêm *</label>
              <input
                type="number"
                min="1"
                required
                value={importForm.quantity}
                onChange={(e) => setImportForm({ ...importForm, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                className="field"
                placeholder="Số lượng"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Ghi chú nhập kho (Mã hóa đơn, nhà cung cấp...)</label>
            <textarea
              rows={2}
              value={importForm.note}
              onChange={(e) => setImportForm({ ...importForm, note: e.target.value })}
              className="field"
              placeholder="VD: Nhập bổ sung 5 áo cho mùa lễ cưới..."
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Xuất kho sản phẩm (Export Stock)"
        description="Ghi nhận giảm số lượng sản phẩm trong kho do hư hại, thanh lý hoặc thất lạc."
        width="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setExportModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="export-stock-form"
              disabled={submitting}
              className="btn btn-sm bg-rose-700 hover:bg-rose-800 text-white"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận xuất kho"}
            </button>
          </div>
        }
      >
        <form id="export-stock-form" onSubmit={handleExportSubmit} className="space-y-4 text-xs">
          <div>
            <label className="field-label">Chọn sản phẩm xuất *</label>
            <select
              value={exportForm.productId}
              onChange={(e) => {
                const prod = products.find((p) => String(p.id) === e.target.value);
                setActiveProduct(prod || null);
                const firstSz = prod?.sizes?.[0]?.size || "FreeSize";
                setExportForm({
                  ...exportForm,
                  productId: e.target.value,
                  size: firstSz,
                });
              }}
              className="field"
              required
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} · {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Kích cỡ *</label>
              <select
                value={exportForm.size}
                onChange={(e) => setExportForm({ ...exportForm, size: e.target.value })}
                className="field"
                required
              >
                {activeProduct?.sizes?.length ? (
                  activeProduct.sizes.map((s) => (
                    <option key={s.size} value={s.size}>
                      Size {s.size} (Khả dụng: {s.stock_quantity ?? 0})
                    </option>
                  ))
                ) : (
                  <option value="FreeSize">Size FreeSize</option>
                )}
              </select>
            </div>

            <div>
              <label className="field-label">Số lượng xuất *</label>
              <input
                type="number"
                min="1"
                required
                value={exportForm.quantity}
                onChange={(e) => setExportForm({ ...exportForm, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                className="field"
                placeholder="Số lượng"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Lý do xuất kho *</label>
            <select
              value={exportForm.reason}
              onChange={(e) => setExportForm({ ...exportForm, reason: e.target.value })}
              className="field"
              required
            >
              <option value="Hư hỏng trong quá trình thuê">Hư hỏng trong quá trình khách thuê</option>
              <option value="Thất lạc / Khách làm mất">Thất lạc / Khách làm mất đền bù</option>
              <option value="Hao mòn cũ thanh lý">Hao mòn trang phục cũ cần thanh lý</option>
              <option value="Chuyển kho / Đi công tác">Điều chuyển kho khác / Trưng bày</option>
              <option value="Khác">Lý do khác</option>
            </select>
          </div>

          <div>
            <label className="field-label">Ghi chú chi tiết</label>
            <textarea
              rows={2}
              value={exportForm.note}
              onChange={(e) => setExportForm({ ...exportForm, note: e.target.value })}
              className="field"
              placeholder="VD: Rách vạt áo dài không thể phục hồi theo biên bản kiểm kê..."
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        title={`Điều chỉnh tồn kho: #${activeProduct?.id} · ${activeProduct?.name || ""}`}
        description="Cập nhật trực tiếp số lượng tồn kho theo từng kích cỡ qua phương thức PATCH."
        width="max-w-lg"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setAdjustModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="adjust-stock-form"
              disabled={submitting}
              className="btn btn-sm"
            >
              {submitting ? "Đang lưu..." : "Cập nhật tồn kho (PATCH)"}
            </button>
          </div>
        }
      >
        <form id="adjust-stock-form" onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
          <div className="rounded-md border border-line bg-surface-2 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-ink">Số lượng tồn kho chi tiết</span>
              <span className="text-accent font-bold">
                Tổng: {adjustSizes.reduce((sum, s) => sum + (parseInt(s.stock_quantity, 10) || 0), 0)} cái
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {adjustSizes.map((item, index) => (
                <div key={item.size} className="rounded border border-line bg-surface p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-ink">Size {item.size}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      parseInt(item.stock_quantity, 10) > 0 ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                    }`}>
                      {parseInt(item.stock_quantity, 10) > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={item.stock_quantity}
                    onChange={(e) => {
                      const copy = [...adjustSizes];
                      copy[index] = {
                        ...copy[index],
                        stock_quantity: Math.max(0, parseInt(e.target.value, 10) || 0),
                      };
                      setAdjustSizes(copy);
                    }}
                    className="field text-xs py-1"
                    placeholder="Số lượng tồn"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-ink-3">
            <span>Dữ liệu sẽ được cập nhật đồng bộ sang bảng product_sizes trong cơ sở dữ liệu.</span>
            {activeProduct?.slug && (
              <Link
                href={`/products/${activeProduct.slug}`}
                target="_blank"
                className="text-accent hover:underline"
              >
                Xem chi tiết &rarr;
              </Link>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-xs text-ink-3">
          Đang tải dữ liệu tồn kho sản phẩm...
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
