"use client";

import { useEffect, useState } from "react";
import { bannerService } from "@/services/bannerService";
import { productService } from "@/services/productService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { StatusChip } from "@/components/ui/Primitives";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";

export default function AdminBannersPage() {
  const toast = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link_url: "/products",
    position: "home_middle",
    sort_order: 1,
    status: "active",
  });

  const reloadBanners = async () => {
    try {
      const data = await bannerService.getAdminBanners();
      setBanners(data);
    } catch {
      toast.push({ tone: "danger", title: "Không thể tải danh sách banner." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const data = await bannerService.getAdminBanners();
        if (active) setBanners(data);
      } catch {
        if (active) toast.push({ tone: "danger", title: "Không thể tải danh sách banner." });
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      image_url: "",
      link_url: "/products",
      position: "home_middle",
      sort_order: (banners.length || 0) + 1,
      status: "active",
    });
    setModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBanner(b);
    setFormData({
      title: b.title || "",
      image_url: b.image_url || "",
      link_url: b.link_url || "/products",
      position: b.position || "home_middle",
      sort_order: b.sort_order ?? 1,
      status: b.status || "active",
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.push({ tone: "danger", title: "Vui lòng chọn file hình ảnh hợp lệ." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.push({ tone: "danger", title: "Dung lượng ảnh tối đa là 5MB." });
      return;
    }

    setUploadingImage(true);
    try {
      const res = await productService.uploadImage(file);
      const url = res.url || (res.relative_path ? `/storage/${res.relative_path}` : "");
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast.push({ tone: "success", title: "Tải ảnh banner thành công!" });
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể tải ảnh lên.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.image_url.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng cung cấp hình ảnh cho banner." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim() || null,
        image_url: formData.image_url.trim(),
        link_url: formData.link_url.trim() || "/products",
        position: formData.position,
        sort_order: Number(formData.sort_order) || 0,
        status: formData.status,
      };

      if (editingBanner) {
        await bannerService.updateBanner(editingBanner.id, payload);
        toast.push({ tone: "success", title: "Cập nhật banner thành công!" });
      } else {
        await bannerService.createBanner(payload);
        toast.push({ tone: "success", title: "Thêm banner mới thành công!" });
      }

      setModalOpen(false);
      await reloadBanners();
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể lưu thông tin banner.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) return;

    try {
      await bannerService.deleteBanner(id);
      toast.push({ tone: "success", title: "Xóa banner thành công!" });
      await reloadBanners();
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể xóa banner.";
      toast.push({ tone: "danger", title: msg });
    }
  };

  const columns = [
    {
      key: "image_url",
      header: "Ảnh banner",
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-28 overflow-hidden rounded border border-line bg-surface-2 shrink-0">
            {b.image_url ? (
              <img src={b.image_url} alt={b.title || "Banner"} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-[10px] text-ink-3">Chưa có ảnh</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-xs text-ink truncate max-w-[200px]">{b.title || "(Không có tiêu đề)"}</p>
            <p className="text-[11px] text-ink-3 truncate max-w-[200px]">{b.link_url || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      header: "Vị trí",
      render: (b) => (
        <span className="font-mono text-xs text-ink-2 bg-surface-2 px-2 py-0.5 rounded border border-line">
          {b.position || "home_middle"}
        </span>
      ),
    },
    {
      key: "sort_order",
      header: "Thứ tự",
      sortValue: (b) => b.sort_order,
      render: (b) => <span className="tabular-nums font-medium text-xs">{b.sort_order}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (b) => (
        <StatusChip tone={b.status === "active" ? "success" : "neutral"}>
          {b.status === "active" ? "Hiển thị" : "Ẩn"}
        </StatusChip>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (b) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPreviewBanner(b)}
            className="btn btn-outline btn-sm gap-1"
            title="Xem trước"
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
        title="Quản lý Banner"
        description="Quản lý hình ảnh và banner quảng bá hiển thị trên trang chủ và các trang."
        actions={
          <button type="button" onClick={openCreateModal} className="btn btn-sm gap-1.5">
            <IconPlus width={14} height={14} /> Thêm banner
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={banners}
        loading={loading}
        emptyTitle="Chưa có banner nào"
        emptyDescription="Tạo banner đầu tiên để làm nổi bật trang chủ của bạn."
      />

      <Drawer
        open={Boolean(previewBanner)}
        onClose={() => setPreviewBanner(null)}
        title="Chi tiết banner"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                const cur = previewBanner;
                setPreviewBanner(null);
                openEditModal(cur);
              }}
              className="btn btn-outline btn-sm"
            >
              Chỉnh sửa
            </button>
            <button type="button" onClick={() => setPreviewBanner(null)} className="btn btn-sm">
              Đóng
            </button>
          </div>
        }
      >
        {previewBanner && (
          <div className="space-y-4 text-xs">
            <div className="overflow-hidden rounded border border-line bg-surface">
              <img
                src={previewBanner.image_url}
                alt={previewBanner.title || "Banner"}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-ink-3">Tiêu đề:</span>
                <p className="font-semibold text-sm text-ink">{previewBanner.title || "(Không có)"}</p>
              </div>
              <div>
                <span className="text-ink-3">Đường dẫn:</span>
                <p className="font-mono text-ink-2 break-all">{previewBanner.link_url || "(Mặc định)"}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <span className="text-ink-3">Vị trí:</span>
                  <p className="font-medium text-ink">{previewBanner.position}</p>
                </div>
                <div>
                  <span className="text-ink-3">Thứ tự:</span>
                  <p className="font-medium text-ink">{previewBanner.sort_order}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBanner ? "Chỉnh sửa banner" : "Thêm banner mới"}
        width="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Tiêu đề banner</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="field"
              placeholder="VD: Bộ Sưu Tập Dạ Hội & Tiệc Cưới 2026"
            />
          </div>

          <div>
            <label className="field-label">Ảnh banner *</label>
            <div className="space-y-2">
              {formData.image_url && (
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded border border-line bg-surface-2">
                  <img src={formData.image_url} alt="Xem trước" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="field text-xs flex-1"
                  placeholder="https://... hoặc tải ảnh từ máy"
                />
                <label className="btn btn-outline btn-sm cursor-pointer shrink-0">
                  {uploadingImage ? "Đang tải..." : "Tải ảnh lên"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Đường dẫn khi click</label>
              <input
                type="text"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="field"
                placeholder="/products"
              />
            </div>
            <div>
              <label className="field-label">Vị trí hiển thị</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="field"
              >
                <option value="home_middle">Trang chủ (Giữa trang)</option>
                <option value="home_main_slider">Trang chủ (Slider chính)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Thứ tự ưu tiên</label>
              <input
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })}
                className="field"
              />
            </div>
            <div>
              <label className="field-label">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="field"
              >
                <option value="active">Hiển thị (Active)</option>
                <option value="hidden">Ẩn (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Hủy
            </button>
            <button type="submit" disabled={submitting || uploadingImage} className="btn btn-sm">
              {submitting ? "Đang lưu..." : editingBanner ? "Cập nhật banner" : "Thêm banner"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
