"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { postService } from "@/services/postService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { StatusChip } from "@/components/ui/Primitives";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/date";

export default function AdminPostCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [previewCategory, setPreviewCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: "active",
  });

  const loadCategories = async () => {
    try {
      const data = await postService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      status: "active",
    });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      status: cat.status || "active",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập tên danh mục bài viết." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug?.trim() || undefined,
        description: formData.description?.trim() || null,
        status: formData.status || "active",
      };

      if (editingCategory) {
        await postService.updateCategory(editingCategory.id, payload);
        toast.push({ tone: "success", title: "Cập nhật danh mục thành công!" });
      } else {
        await postService.createCategory(payload);
        toast.push({ tone: "success", title: "Thêm danh mục mới thành công!" });
      }

      setModalOpen(false);
      await loadCategories();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.name?.[0] ||
        err.response?.data?.message ||
        "Không thể lưu danh mục bài viết.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục bài viết này?")) return;
    try {
      await postService.deleteCategory(id);
      toast.push({ tone: "success", title: "Đã xóa danh mục bài viết thành công." });
      await loadCategories();
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể xóa danh mục đang có bài viết.";
      toast.push({ tone: "danger", title: msg });
    }
  };

  const columns = [
    {
      key: "name",
      header: "Tên danh mục",
      sortValue: (c) => c.name,
      render: (c) => (
        <div>
          <p className="font-medium text-ink">{c.name}</p>
          <p className="text-[11px] text-ink-3">/{c.slug}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Mô tả",
      width: "220px",
      render: (c) => (
        <p className="text-xs text-ink-2 max-w-[200px] truncate">
          {c.description || "—"}
        </p>
      ),
    },
    {
      key: "posts_count",
      header: "Số bài viết",
      sortValue: (c) => c.posts_count || 0,
      render: (c) => (
        <span className="font-medium text-ink">
          {c.posts_count || 0} bài viết
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (c) => (
        <StatusChip tone={c.status === "active" ? "success" : "danger"}>
          {c.status === "active" ? "Hoạt động" : "Ẩn"}
        </StatusChip>
      ),
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
            className="btn btn-outline btn-sm gap-1 uppercase text-xs"
            title="Xem chi tiết"
          >
            <IconEye width={13} height={13} /> Xem
          </button>
          <button
            type="button"
            onClick={() => openEditModal(c)}
            className="btn btn-outline btn-sm gap-1 uppercase text-xs"
            title="Chỉnh sửa"
          >
            <IconEdit width={13} height={13} /> Sửa
          </button>
          <button
            type="button"
            onClick={() => handleDelete(c.id)}
            className="btn btn-danger btn-sm gap-1 uppercase text-xs"
            title="Xóa danh mục"
          >
            <IconTrash width={13} height={13} /> Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2 text-xs text-ink-3">
          <Link href="/admin/posts" className="text-ink-2 hover:text-ink transition-colors">
            Quản lý bài viết
          </Link>
          <span>/</span>
          <span className="font-semibold text-ink">Danh mục bài viết</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/posts"
            className="btn btn-outline btn-sm text-xs"
          >
            ← Quay lại tất cả bài viết
          </Link>
        </div>
      </div>

      <PageHeader
        title="Danh mục bài viết"
        description="Quản lý và phân loại các chuyên mục tin tức, cẩm nang thời trang."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/posts"
              className="btn btn-outline btn-sm text-xs"
            >
              Tất cả bài viết
            </Link>
            <button
              type="button"
              onClick={openCreateModal}
              className="btn btn-sm gap-1.5 text-xs uppercase"
            >
              <IconPlus width={14} height={14} /> Thêm danh mục mới
            </button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        rows={categories}
        getKey={(c) => c.id || c.slug}
        loading={loading}
      />

      <Drawer
        open={Boolean(previewCategory)}
        onClose={() => setPreviewCategory(null)}
        title={previewCategory?.name || "Chi tiết danh mục"}
        subtitle={`Đường dẫn tĩnh: /${previewCategory?.slug || ""}`}
        width="max-w-lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const target = previewCategory;
                setPreviewCategory(null);
                openEditModal(target);
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-warm px-2 py-0.5 text-xs font-medium text-ink">
                {previewCategory.posts_count || 0} bài viết trực thuộc
              </span>
              <StatusChip tone={previewCategory.status === "active" ? "success" : "neutral"}>
                {previewCategory.status === "active" ? "Đang hoạt động" : "Tạm ẩn"}
              </StatusChip>
            </div>

            <div className="rounded-lg border border-line bg-surface p-4 space-y-2">
              <p className="text-[11px] text-ink-3">
                ID danh mục: #{previewCategory.id} · Cập nhật: {formatDate(previewCategory.updated_at?.slice(0, 10))}
              </p>
              <h3 className="font-serif text-lg font-bold text-ink">
                {previewCategory.name}
              </h3>
              <p className="text-xs font-mono text-accent">
                Slug: {previewCategory.slug}
              </p>
            </div>

            <div className="rounded-lg border border-line bg-surface p-4">
              <h4 className="text-xs font-semibold text-ink mb-2">Mô tả danh mục</h4>
              <p className="text-xs text-ink-2 leading-relaxed">
                {previewCategory.description || "Chưa có mô tả cho chuyên mục này."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/news?category=${previewCategory.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                <span>Xem các bài viết thuộc danh mục trên web</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Chỉnh sửa danh mục bài viết" : "Thêm danh mục bài viết mới"}
        width="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Tên danh mục *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="field"
              placeholder="VD: Xu hướng thời trang, Cẩm nang phối đồ..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Đường dẫn tĩnh (Slug)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="field"
                placeholder="Tự động tạo theo tên nếu để trống"
              />
            </div>

            <div>
              <label className="field-label">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="field"
              >
                <option value="active">Đang hoạt động</option>
                <option value="hidden">Tạm ẩn</option>
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="field text-xs"
              placeholder="Mô tả tóm tắt về các chủ đề trong danh mục này..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-line">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-sm disabled:opacity-60"
            >
              {submitting ? "Đang lưu..." : editingCategory ? "Lưu thay đổi" : "Tạo danh mục"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
