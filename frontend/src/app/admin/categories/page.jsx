"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { categoryService } from "@/services/categoryService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [previewCategory, setPreviewCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const query = search.trim().toLowerCase();
    return categories.filter((c) => {
      return (
        c.name?.toLowerCase().includes(query) ||
        c.slug?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        String(c.id).includes(query)
      );
    });
  }, [categories, search]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "" });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập tên danh mục." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description || null,
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, payload);
        toast.push({ tone: "success", title: "Cập nhật danh mục thành công!" });
      } else {
        await categoryService.createCategory(payload);
        toast.push({ tone: "success", title: "Tạo danh mục mới thành công!" });
      }
      setModalOpen(false);
      await loadCategories();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.name?.[0] ||
        err.response?.data?.message ||
        "Không thể lưu danh mục. Vui lòng kiểm tra lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await categoryService.deleteCategory(id);
        toast.push({ tone: "success", title: "Đã chuyển danh mục vào thùng rác." });
        await loadCategories();
      } catch (err) {
        const msg = err.response?.data?.message || "Không thể xóa danh mục.";
        toast.push({ tone: "danger", title: msg });
      }
    }
  };

  const columns = [
    {
      key: "name",
      header: "Tên danh mục",
      sortValue: (c) => c.name,
      render: (c) => <span className="font-semibold text-ink">{c.name}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      render: (c) => <span className="font-mono text-xs text-ink-3">{c.slug}</span>,
    },
    {
      key: "description",
      header: "Mô tả",
      render: (c) => <span className="text-[12.5px] text-ink-2">{c.description || "—"}</span>,
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPreviewCategory(c)}
            className="btn btn-outline btn-sm gap-1"
            title="Xem chi tiết"
          >
            <IconEye width={13} height={13} /> Xem
          </button>
          <button
            type="button"
            onClick={() => openEditModal(c)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconEdit width={13} height={13} /> Sửa
          </button>
          <button
            type="button"
            onClick={() => handleDelete(c.id)}
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
        title="Quản lý danh mục"
        description="Các danh mục phân loại trang phục trong hệ thống."
        actions={
          <button type="button" onClick={openCreateModal} className="btn btn-sm gap-1.5">
            <IconPlus width={14} height={14} /> Thêm danh mục
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3 text-xs">
        <div className="flex flex-1 items-center gap-2.5 max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên danh mục, mã, slug..."
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
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="btn btn-ghost btn-sm h-9 px-2 text-ink-2 hover:text-danger text-xs"
            >
              Đặt lại
            </button>
          )}
        </div>

        <div className="text-ink-3 text-[11.5px] whitespace-nowrap">
          Tìm thấy <span className="font-semibold text-ink">{filteredCategories.length}</span> danh mục
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredCategories}
        getKey={(c) => c.id || c.slug}
        loading={loading}
      />

      <Drawer
        open={Boolean(previewCategory)}
        onClose={() => setPreviewCategory(null)}
        title={previewCategory?.name || "Chi tiết danh mục"}
        subtitle={`Mã: ${previewCategory?.id || ""} · Slug: ${previewCategory?.slug || ""}`}
        width="max-w-md"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const cat = previewCategory;
                setPreviewCategory(null);
                openEditModal(cat);
              }}
              className="btn btn-outline btn-sm gap-1.5"
            >
              <IconEdit width={14} height={14} /> Chỉnh sửa
            </button>
            <button
              type="button"
              onClick={() => setPreviewCategory(null)}
              className="btn btn-sm"
            >
              Đóng
            </button>
          </div>
        }
      >
        {previewCategory && (
          <div className="space-y-5 text-[13px]">
            <div className="rounded-lg border border-line bg-surface p-4 space-y-3">
              <div>
                <p className="text-[11px] text-ink-3">Tên danh mục</p>
                <p className="text-base font-bold text-ink mt-0.5">{previewCategory.name}</p>
              </div>

              <div>
                <p className="text-[11px] text-ink-3">Đường dẫn tĩnh (Slug)</p>
                <p className="font-mono text-xs text-accent mt-0.5">{previewCategory.slug}</p>
              </div>

              <div>
                <p className="text-[11px] text-ink-3">Mô tả danh mục</p>
                <p className="text-xs text-ink-2 mt-0.5 leading-relaxed whitespace-pre-line">
                  {previewCategory.description || "Chưa có mô tả cho danh mục này."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/products?category=${previewCategory.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                <span>Xem tất cả sản phẩm thuộc danh mục này</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Tên danh mục</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="field"
              placeholder="Ví dụ: Áo dài truyền thống"
            />
          </div>

          <div>
            <label className="field-label">Mô tả (tùy chọn)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="field"
              placeholder="Mô tả phong cách và đặc điểm trang phục trong danh mục này..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Hủy
            </button>
            <button type="submit" disabled={submitting} className="btn btn-sm">
              {submitting ? "Đang lưu..." : "Lưu danh mục"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
