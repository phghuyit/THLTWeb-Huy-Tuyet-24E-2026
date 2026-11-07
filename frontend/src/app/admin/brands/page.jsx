"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brandService } from "@/services/brandService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";

export default function AdminBrandsPage() {
  const toast = useToast();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [previewBrand, setPreviewBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const loadBrands = async () => {
    try {
      const data = await brandService.getBrands();
      setBrands(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormData({ name: "", slug: "", description: "" });
    setModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBrand(b);
    setFormData({
      name: b.name || "",
      slug: b.slug || "",
      description: b.description || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập tên thương hiệu." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description || null,
      };

      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, payload);
        toast.push({ tone: "success", title: "Cập nhật thương hiệu thành công!" });
      } else {
        await brandService.createBrand(payload);
        toast.push({ tone: "success", title: "Tạo thương hiệu mới thành công!" });
      }
      setModalOpen(false);
      await loadBrands();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.name?.[0] ||
        err.response?.data?.message ||
        "Không thể lưu thương hiệu. Vui lòng kiểm tra lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      try {
        await brandService.deleteBrand(id);
        toast.push({ tone: "success", title: "Đã chuyển thương hiệu vào thùng rác." });
        await loadBrands();
      } catch (err) {
        const msg = err.response?.data?.message || "Không thể xóa thương hiệu.";
        toast.push({ tone: "danger", title: msg });
      }
    }
  };

  const columns = [
    {
      key: "name",
      header: "Tên thương hiệu",
      sortValue: (b) => b.name,
      render: (b) => <span className="font-semibold text-ink">{b.name}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      render: (b) => <span className="font-mono text-xs text-ink-3">{b.slug}</span>,
    },
    {
      key: "description",
      header: "Mô tả",
      render: (b) => <span className="text-[12.5px] text-ink-2">{b.description || "—"}</span>,
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (b) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPreviewBrand(b)}
            className="btn btn-outline btn-sm gap-1"
            title="Xem chi tiết"
          >
            <IconEye width={13} height={13} /> Xem
          </button>
          <button
            type="button"
            onClick={() => openEditModal(b)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconEdit width={13} height={13} /> Sửa
          </button>
          <button
            type="button"
            onClick={() => handleDelete(b.id)}
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
        title="Quản lý thương hiệu"
        description="Danh sách các thương hiệu & nhà thiết kế liên kết."
        actions={
          <button type="button" onClick={openCreateModal} className="btn btn-sm gap-1.5">
            <IconPlus width={14} height={14} /> Thêm thương hiệu
          </button>
        }
      />

      <DataTable
        columns={columns}
        rows={brands}
        getKey={(b) => b.id || b.slug}
        loading={loading}
      />

      <Drawer
        open={Boolean(previewBrand)}
        onClose={() => setPreviewBrand(null)}
        title={previewBrand?.name || "Chi tiết thương hiệu"}
        subtitle={`Mã: ${previewBrand?.id || ""} · Slug: ${previewBrand?.slug || ""}`}
        width="max-w-md"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const brand = previewBrand;
                setPreviewBrand(null);
                openEditModal(brand);
              }}
              className="btn btn-outline btn-sm gap-1.5"
            >
              <IconEdit width={14} height={14} /> Chỉnh sửa
            </button>
            <button
              type="button"
              onClick={() => setPreviewBrand(null)}
              className="btn btn-sm"
            >
              Đóng
            </button>
          </div>
        }
      >
        {previewBrand && (
          <div className="space-y-5 text-[13px]">
            <div className="rounded-lg border border-line bg-surface p-4 space-y-3">
              <div>
                <p className="text-[11px] text-ink-3">Tên thương hiệu / Nhà thiết kế</p>
                <p className="text-base font-bold text-ink mt-0.5">{previewBrand.name}</p>
              </div>

              <div>
                <p className="text-[11px] text-ink-3">Đường dẫn tĩnh (Slug)</p>
                <p className="font-mono text-xs text-accent mt-0.5">{previewBrand.slug}</p>
              </div>

              <div>
                <p className="text-[11px] text-ink-3">Giới thiệu thương hiệu</p>
                <p className="text-xs text-ink-2 mt-0.5 leading-relaxed whitespace-pre-line">
                  {previewBrand.description || "Chưa có thông tin mô tả cho thương hiệu này."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/products?brand=${previewBrand.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                <span>Xem tất cả sản phẩm của thương hiệu này</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Tên thương hiệu</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="field"
              placeholder="Ví dụ: SIXDO, Ivy Moda, v.v."
            />
          </div>

          <div>
            <label className="field-label">Mô tả (tùy chọn)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="field"
              placeholder="Giới thiệu phong cách thiết kế và thông tin thương hiệu..."
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
              {submitting ? "Đang lưu..." : "Lưu thương hiệu"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
