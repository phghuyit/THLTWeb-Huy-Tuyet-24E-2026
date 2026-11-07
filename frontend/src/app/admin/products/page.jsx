"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { brandService } from "@/services/brandService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { StatusChip } from "@/components/ui/Primitives";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";
import { formatVnd } from "@/lib/money";

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    brand_id: "",
    rental_price_per_day: "",
    original_value: "",
    thumbnail: "",
    description: "",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const nameMatch = p.name?.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query);
        const skuMatch = String(p.id).includes(query) || p.slug?.toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !skuMatch) return false;
      }

      if (selectedCategory !== "all") {
        const catId = p.category_id || p.category?.id;
        const catSlug = p.category?.slug || p.categorySlug;
        if (String(catId) !== String(selectedCategory) && catSlug !== selectedCategory) {
          return false;
        }
      }

      if (selectedBrand !== "all") {
        const brandId = p.brand_id || p.brand?.id;
        if (String(brandId) !== String(selectedBrand)) {
          return false;
        }
      }

      if (selectedStatus === "featured" && !p.is_featured) return false;
      if (selectedStatus === "sale" && !p.is_sale) return false;
      if (selectedStatus === "in_stock") {
        const stock = p.total_stock ?? (p.sizes ? p.sizes.reduce((sum, s) => sum + (s.stock_quantity || 0), 0) : 0);
        if (stock <= 0) return false;
      }
      if (selectedStatus === "out_of_stock") {
        const stock = p.total_stock ?? (p.sizes ? p.sizes.reduce((sum, s) => sum + (s.stock_quantity || 0), 0) : 0);
        if (stock > 0) return false;
      }

      return true;
    });
  }, [products, search, selectedCategory, selectedBrand, selectedStatus]);

  const hasActiveFilters = search.trim() !== "" || selectedCategory !== "all" || selectedBrand !== "all" || selectedStatus !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedStatus("all");
  };

  const loadData = async () => {
    try {
      const [prods, cats, brs] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
        brandService.getBrands(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setBrands(brs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category_id: categories[0]?.id || "",
      brand_id: brands[0]?.id || "",
      rental_price_per_day: "",
      sale_rental_price: "",
      is_sale: false,
      deposit_price: "",
      original_value: "",
      thumbnail: "",
      description: "",
      sizes: [
        { size: "S", stock_quantity: 5 },
        { size: "M", stock_quantity: 5 },
        { size: "L", stock_quantity: 5 },
        { size: "XL", stock_quantity: 2 },
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    const existingSizes = Array.isArray(prod.sizes) && prod.sizes.length > 0
      ? prod.sizes.map((s) => ({ size: s.size, stock_quantity: s.stock_quantity ?? 0 }))
      : [
          { size: "S", stock_quantity: 5 },
          { size: "M", stock_quantity: 5 },
          { size: "L", stock_quantity: 5 },
          { size: "XL", stock_quantity: 2 },
        ];

    setFormData({
      name: prod.name || "",
      category_id: prod.category_id || prod.category?.id || categories[0]?.id || "",
      brand_id: prod.brand_id || prod.brand?.id || "",
      rental_price_per_day: prod.rental_price_per_day || prod.pricePerDay || "",
      sale_rental_price: prod.sale_rental_price || "",
      is_sale: Boolean(prod.is_sale),
      deposit_price: prod.deposit_price || "",
      original_value: prod.original_value || prod.replacementValue || "",
      thumbnail: prod.thumbnail || "",
      description: prod.description || "",
      sizes: existingSizes,
    });
    setModalOpen(true);
  };

  const uploadSelectedFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      toast.push({ tone: "danger", title: "Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WEBP, GIF)." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.push({ tone: "danger", title: "Dung lượng ảnh tối đa là 5MB." });
      return;
    }
    setUploadingImage(true);
    try {
      const res = await productService.uploadImage(file);
      const imageUrl = res.url || (res.relative_path ? `/storage/${res.relative_path}` : "");
      setFormData((prev) => ({
        ...prev,
        thumbnail: imageUrl,
      }));
      toast.push({ tone: "success", title: "Tải ảnh sản phẩm thành công!" });
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể tải ảnh lên. Vui lòng thử lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadSelectedFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadSelectedFile(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập tên sản phẩm." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category_id: parseInt(formData.category_id, 10),
        brand_id: formData.brand_id ? parseInt(formData.brand_id, 10) : null,
        rental_price_per_day: parseInt(formData.rental_price_per_day, 10) || 0,
        sale_rental_price: formData.sale_rental_price ? parseInt(formData.sale_rental_price, 10) : null,
        is_sale: Boolean(formData.is_sale),
        deposit_price: formData.deposit_price ? parseInt(formData.deposit_price, 10) : null,
        original_value: parseInt(formData.original_value, 10) || 0,
        thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        description: formData.description || null,
      };

      if (!editingProduct) {
        payload.images = [{ image_url: payload.thumbnail, sort_order: 1 }];
        payload.sizes = (formData.sizes || []).map((s) => ({
          size: s.size,
          stock_quantity: Math.max(0, parseInt(s.stock_quantity, 10) || 0),
        }));
        await productService.createProduct(payload);
        toast.push({ tone: "success", title: "Thêm sản phẩm thành công!" });
      } else {
        await productService.updateProduct(editingProduct.id, payload);
        toast.push({ tone: "success", title: "Cập nhật sản phẩm thành công!" });
      }

      setModalOpen(false);
      await loadData();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.name?.[0] ||
        err.response?.data?.message ||
        "Không thể lưu sản phẩm. Vui lòng kiểm tra lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productService.deleteProduct(id);
        toast.push({ tone: "success", title: "Đã chuyển sản phẩm vào thùng rác." });
        await loadData();
      } catch (err) {
        toast.push({ tone: "danger", title: "Không thể xóa sản phẩm." });
      }
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
            src={p.thumbnail || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=120&q=80"}
            alt={p.name}
            className="h-10 w-10 rounded object-cover"
          />
          <div>
            <p className="font-medium text-ink">{p.name}</p>
            <p className="text-[11.5px] text-ink-3">{p.sku || `SP-${p.id}`}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Danh mục",
      render: (p) => p.category?.name || p.categorySlug || "Áo dài",
    },
    {
      key: "price",
      header: "Giá thuê / ngày",
      align: "right",
      sortValue: (p) => p.rental_price_per_day || p.pricePerDay || 0,
      render: (p) => (
        <span className="font-semibold text-accent">
          {formatVnd(p.rental_price_per_day || p.pricePerDay || 0)}
        </span>
      ),
    },
    {
      key: "original",
      header: "Giá trị gốc",
      align: "right",
      render: (p) => formatVnd(p.original_value || p.replacementValue || 0),
    },
    {
      key: "stock",
      header: "Tồn kho",
      align: "center",
      sortValue: (p) => (p.total_stock ?? (p.sizes ? p.sizes.reduce((sum, s) => sum + (s.stock_quantity || 0), 0) : 0)),
      render: (p) => {
        const totalStock = p.total_stock ?? (p.sizes ? p.sizes.reduce((sum, s) => sum + (s.stock_quantity || 0), 0) : 0);
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              totalStock > 0
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {totalStock > 0 ? `${totalStock} cái` : "Hết hàng"}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (p) => (
        <StatusChip tone={p.is_featured ? "warning" : "success"}>
          {p.is_featured ? "Nổi bật" : "Sẵn sàng"}
        </StatusChip>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPreviewProduct(p)}
            className="btn btn-outline btn-sm gap-1"
            title="Xem chi tiết"
          >
            <IconEye width={13} height={13} /> Xem
          </button>
          <button
            type="button"
            onClick={() => openEditModal(p)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconEdit width={13} height={13} /> Sửa
          </button>
          <button
            type="button"
            onClick={() => handleDelete(p.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý sản phẩm"
        description="Danh sách sản phẩm trong kho phục vụ cho thuê."
        actions={
          <button type="button" onClick={openCreateModal} className="btn btn-sm gap-1.5">
            <IconPlus width={14} height={14} /> Thêm sản phẩm
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3 text-xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, mã, slug..."
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
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="field h-9 text-xs min-w-[140px]"
            aria-label="Lọc theo thương hiệu"
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="field h-9 text-xs min-w-[130px]"
            aria-label="Lọc theo trạng thái"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="featured">Sản phẩm nổi bật</option>
            <option value="sale">Đang giảm giá</option>
            <option value="in_stock">Còn hàng</option>
            <option value="out_of_stock">Hết hàng</option>
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
          Tìm thấy <span className="font-semibold text-ink">{filteredProducts.length}</span> sản phẩm
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredProducts}
        getKey={(p) => p.id}
        loading={loading}
      />

      <Drawer
        open={Boolean(previewProduct)}
        onClose={() => setPreviewProduct(null)}
        title={previewProduct?.name || "Chi tiết sản phẩm"}
        subtitle={previewProduct?.sku || `Mã SP: ${previewProduct?.id || ""}`}
        width="max-w-md"
        footer={
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/admin/inventory?productId=${previewProduct?.id}`}
              className="btn btn-outline btn-sm gap-1.5 text-accent border-accent/40 hover:bg-accent-soft"
              onClick={() => setPreviewProduct(null)}
            >
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
              Quản lý kho
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const prod = previewProduct;
                  setPreviewProduct(null);
                  openEditModal(prod);
                }}
                className="btn btn-outline btn-sm gap-1.5"
              >
                <IconEdit width={14} height={14} /> Chỉnh sửa
              </button>
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="btn btn-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        }
      >
        {previewProduct && (
          <div className="space-y-5 text-[13px]">
            <div className="overflow-hidden rounded-lg border border-line bg-surface">
              <img
                src={previewProduct.thumbnail || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"}
                alt={previewProduct.name}
                className="h-56 w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-warm px-2 py-0.5 text-xs font-medium text-ink">
                {previewProduct.category?.name || previewProduct.categorySlug || "Áo dài"}
              </span>
              {previewProduct.brand?.name && (
                <span className="rounded bg-line px-2 py-0.5 text-xs text-ink-2">
                  {previewProduct.brand.name}
                </span>
              )}
              <StatusChip tone={previewProduct.is_featured ? "warning" : "success"}>
                {previewProduct.is_featured ? "Nổi bật" : "Sẵn sàng cho thuê"}
              </StatusChip>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-lg border border-line bg-surface p-4">
              <div>
                <p className="text-[11px] text-ink-3">Giá thuê / ngày</p>
                <p className="text-sm font-bold text-accent">
                  {formatVnd(previewProduct.is_sale && previewProduct.sale_rental_price ? previewProduct.sale_rental_price : (previewProduct.rental_price_per_day || previewProduct.pricePerDay || 0))}
                </p>
                {previewProduct.is_sale && previewProduct.sale_rental_price && (
                  <p className="text-[10px] text-ink-3 line-through">
                    {formatVnd(previewProduct.rental_price_per_day || 0)}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[11px] text-ink-3">Tiền đặt cọc (70%)</p>
                <p className="text-sm font-semibold text-ink">
                  {formatVnd(previewProduct.deposit_price || Math.round((previewProduct.original_value || previewProduct.replacementValue || 0) * 0.70))}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-ink-3">Giá trị sản phẩm</p>
                <p className="text-sm font-semibold text-ink">
                  {formatVnd(previewProduct.original_value || previewProduct.replacementValue || 0)}
                </p>
              </div>
            </div>

            {previewProduct.sizes && previewProduct.sizes.length > 0 && (
              <div className="rounded-lg border border-line bg-surface p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-ink">Kích thước & Số lượng trong kho</h4>
                  <Link
                    href={`/admin/inventory?productId=${previewProduct.id}`}
                    className="text-[11px] font-medium text-accent hover:underline flex items-center gap-1"
                    onClick={() => setPreviewProduct(null)}
                  >
                    <span>Quản lý kho</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {previewProduct.sizes.map((s, idx) => (
                    <div key={idx} className="rounded border border-line px-2.5 py-1 text-xs">
                      <span className="font-semibold text-ink">{s.size}</span>
                      <span className="ml-1.5 text-ink-3">({s.stock_quantity ?? s.stock ?? 1} cái)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-line bg-surface p-4">
              <h4 className="text-xs font-semibold text-ink mb-1.5">Mô tả sản phẩm</h4>
              <p className="text-xs text-ink-2 leading-relaxed whitespace-pre-line">
                {previewProduct.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>

            {previewProduct.slug && (
              <div className="pt-1">
                <Link
                  href={`/products/${previewProduct.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                >
                  <span>Xem trên trang người dùng</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        width="max-w-2xl"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="admin-product-form"
              disabled={submitting || uploadingImage}
              className="btn btn-sm"
            >
              {submitting ? "Đang lưu..." : uploadingImage ? "Đang tải ảnh..." : "Lưu sản phẩm"}
            </button>
          </div>
        }
      >
        <form id="admin-product-form" onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Tên sản phẩm</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Danh mục</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="field"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Thương hiệu</label>
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                className="field"
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Giá thuê / ngày (VNĐ)</label>
              <input
                type="number"
                required
                value={formData.rental_price_per_day}
                onChange={(e) => setFormData({ ...formData, rental_price_per_day: e.target.value })}
                className="field"
              />
            </div>

            <div>
              <label className="field-label">Giá trị gốc (VNĐ)</label>
              <input
                type="number"
                value={formData.original_value}
                onChange={(e) => setFormData({ ...formData, original_value: e.target.value })}
                className="field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Tiền đặt cọc (VNĐ)</label>
              <input
                type="number"
                placeholder={
                  formData.original_value
                    ? `Mặc định: ${Math.round(Number(formData.original_value) * 0.7).toLocaleString("vi-VN")}₫ (70%)`
                    : "Mặc định 70% giá trị gốc"
                }
                value={formData.deposit_price}
                onChange={(e) => setFormData({ ...formData, deposit_price: e.target.value })}
                className="field"
              />
              <p className="mt-1 text-[11px] text-ink-3">Để trống sẽ tự động tính bằng 70% giá trị gốc</p>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.is_sale}
                  onChange={(e) => setFormData({ ...formData, is_sale: e.target.checked })}
                  className="rounded border-line text-accent focus:ring-accent"
                />
                <span className="text-xs font-semibold text-ink">Bật giá khuyến mãi (Sale)</span>
              </label>

              {formData.is_sale && (
                <div className="mt-2">
                  <input
                    type="number"
                    placeholder="Giá thuê khuyến mãi (VNĐ)"
                    value={formData.sale_rental_price}
                    onChange={(e) => setFormData({ ...formData, sale_rental_price: e.target.value })}
                    className="field text-xs"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface-2 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="field-label mb-0">Số lượng tồn kho theo kích cỡ</label>
              <span className="text-xs font-semibold text-accent">
                Tổng tồn: {formData.sizes?.reduce((sum, s) => sum + (parseInt(s.stock_quantity, 10) || 0), 0) || 0} cái
              </span>
            </div>
            {editingProduct ? (
              <div className="rounded-md border border-amber-200 bg-amber-50/80 p-2.5 text-[11.5px] text-amber-900 flex flex-wrap items-center justify-between gap-2">
                <span>Số lượng tồn kho được quản lý tập trung qua trang Quản lý kho.</span>
                <Link
                  href={`/admin/inventory?productId=${editingProduct.id}`}
                  className="btn btn-xs bg-white text-ink border border-amber-300 hover:bg-amber-100 shrink-0 font-medium"
                  target="_blank"
                >
                  Đến Quản lý kho &rarr;
                </Link>
              </div>
            ) : (
              <p className="text-[11.5px] text-ink-3">
                Cập nhật số lượng sẵn có ban đầu trong kho cho từng kích cỡ.
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {formData.sizes?.map((item, index) => (
                <div key={item.size} className="rounded border border-line bg-surface p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-ink">Size {item.size}</span>
                    <span className={`text-[10px] px-1 rounded font-medium ${parseInt(item.stock_quantity, 10) > 0 ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}>
                      {parseInt(item.stock_quantity, 10) > 0 ? "Còn hàng" : "Hết"}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    disabled={Boolean(editingProduct)}
                    value={item.stock_quantity}
                    onChange={(e) => {
                      if (editingProduct) return;
                      const newSizes = [...formData.sizes];
                      newSizes[index] = {
                        ...newSizes[index],
                        stock_quantity: Math.max(0, parseInt(e.target.value, 10) || 0),
                      };
                      setFormData({ ...formData, sizes: newSizes });
                    }}
                    className="field text-xs py-1 disabled:opacity-60 disabled:bg-surface-2 disabled:cursor-not-allowed"
                    placeholder="Số lượng"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Ảnh đại diện sản phẩm</label>
            <div className="space-y-3">
              {formData.thumbnail ? (
                <div className="flex items-start gap-4 p-3 rounded-lg border border-line bg-surface-2">
                  <img
                    src={formData.thumbnail}
                    alt="Xem trước ảnh"
                    className="h-28 w-20 rounded-md object-cover border border-line bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ink break-all line-clamp-2">
                      {formData.thumbnail}
                    </p>
                    <p className="text-[11px] text-ink-3 mt-1">Ảnh đại diện chính của sản phẩm</p>
                    <div className="mt-3 flex items-center gap-2">
                      <label className="btn btn-outline btn-xs cursor-pointer">
                        Thay đổi ảnh
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={handleFileChange}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, thumbnail: "" }))}
                        className="btn btn-ghost btn-xs text-danger"
                      >
                        Xóa ảnh
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                    isDragging
                      ? "border-accent bg-accent-soft/30"
                      : "border-line bg-surface-2/40 hover:border-ink-3"
                  }`}
                >
                  <input
                    id="product-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="product-file-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink-2">
                      {uploadingImage ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                      ) : (
                        <IconPlus width={18} height={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-ink">
                        {uploadingImage ? "Đang tải ảnh lên máy chủ..." : "Kéo thả ảnh vào đây hoặc nhấp để chọn"}
                      </p>
                      <p className="text-[11px] text-ink-3 mt-0.5">
                        Hỗ trợ PNG, JPG, WEBP, GIF tối đa 5MB
                      </p>
                    </div>
                  </label>
                </div>
              )}

              <div>
                <details className="text-[11.5px] text-ink-3">
                  <summary className="cursor-pointer hover:text-ink select-none">
                    Hoặc nhập URL ảnh từ xa &rarr;
                  </summary>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="field text-xs"
                      placeholder="https://..."
                    />
                  </div>
                </details>
              </div>
            </div>
          </div>

          <div>
            <label className="field-label">Mô tả</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="field"
            />
          </div>

        </form>
      </Modal>
    </div>
  );
}
