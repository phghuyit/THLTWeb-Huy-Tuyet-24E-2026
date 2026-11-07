"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { menuService } from "@/services/menuService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { StatusChip } from "@/components/ui/Primitives";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";

export default function AdminMenusPage() {
  const toast = useToast();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterPosition, setFilterPosition] = useState("all");
  const [showSubmenus, setShowSubmenus] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [previewMenu, setPreviewMenu] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    link: "",
    parent_id: "",
    position: "header",
    sort_order: 1,
    status: "active",
  });

  const loadData = async (activePreviewId = null) => {
    try {
      const data = await menuService.getAdminMenus();
      setMenus(data);
      const targetId = activePreviewId ?? previewMenu?.id;
      if (targetId) {
        const found = data.find((m) => m.id === targetId);
        setPreviewMenu(found || null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = (parentId = "") => {
    setEditingMenu(null);
    setFormData({
      name: "",
      link: "",
      parent_id: parentId ? String(parentId) : "",
      position: filterPosition === "footer" ? "footer" : "header",
      sort_order: menus.length + 1,
      status: "active",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingMenu(item);
    setFormData({
      name: item.name || "",
      link: item.link || "",
      parent_id: item.parent_id ? String(item.parent_id) : "",
      position: item.position || "header",
      sort_order: item.sort_order ?? 1,
      status: item.status || "active",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.link.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập tên menu và đường dẫn liên kết." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        link: formData.link.trim(),
        parent_id: formData.parent_id ? parseInt(formData.parent_id, 10) : null,
        position: formData.position || "header",
        sort_order: parseInt(formData.sort_order, 10) || 0,
        status: formData.status || "active",
      };

      if (!editingMenu) {
        await menuService.createMenu(payload);
        toast.push({ tone: "success", title: "Thêm mục menu mới thành công!" });
      } else {
        await menuService.updateMenu(editingMenu.id, payload);
        toast.push({ tone: "success", title: "Cập nhật menu thành công!" });
      }

      setModalOpen(false);
      await loadData(previewMenu?.id || (payload.parent_id ? payload.parent_id : null));
    } catch (err) {
      const msg =
        err.response?.data?.errors?.name?.[0] ||
        err.response?.data?.message ||
        "Không thể lưu menu. Vui lòng kiểm tra lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa mục menu này?")) {
      try {
        await menuService.deleteMenu(id);
        toast.push({ tone: "success", title: "Đã xóa mục menu." });
        await loadData(previewMenu?.id);
      } catch (err) {
        toast.push({ tone: "danger", title: "Không thể xóa menu." });
      }
    }
  };

  const tableRows = menus.flatMap((parent) => {
    if (filterPosition !== "all" && parent.position !== filterPosition) return [];
    const parentRow = { ...parent, isChild: false };

    if (showSubmenus && Array.isArray(parent.children) && parent.children.length > 0) {
      const childRows = parent.children.map((child) => ({
        ...child,
        isChild: true,
        parentName: parent.name,
        position: child.position || parent.position,
      }));
      return [parentRow, ...childRows];
    }

    return [parentRow];
  });

  const columns = [
    {
      key: "name",
      header: "Tên hiển thị",
      sortValue: (m) => m.name,
      render: (m) => (
        <div className={m.isChild ? "pl-5 border-l-2 border-accent/40 ml-2 py-0.5" : ""}>
          <div className="flex items-center gap-2">
            {m.isChild && (
              <span className="text-accent text-xs font-bold select-none">↳</span>
            )}
            <p className={`font-semibold ${m.isChild ? "text-ink/85 text-xs" : "text-ink"}`}>
              {m.name}
            </p>
            {!m.isChild && Array.isArray(m.children) && m.children.length > 0 && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                {m.children.length} submenu
              </span>
            )}
            {m.isChild && (
              <span className="rounded bg-warm px-1.5 py-0.5 text-[9.5px] text-ink-3 border border-line">
                Con của: {m.parentName}
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-ink-3 mt-0.5">{m.link}</p>
        </div>
      ),
    },
    {
      key: "position",
      header: "Vị trí",
      render: (m) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            m.position === "header"
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-purple-50 text-purple-700 border border-purple-200"
          }`}
        >
          {m.position === "header" ? "Header (Đầu trang)" : "Footer (Chân trang)"}
        </span>
      ),
    },
    {
      key: "sort_order",
      header: "Thứ tự",
      align: "center",
      sortValue: (m) => m.sort_order,
      render: (m) => <span className="tabular-nums text-xs font-medium">{m.sort_order}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (m) => (
        <StatusChip tone={m.status === "active" ? "success" : "neutral"}>
          {m.status === "active" ? "Hiển thị" : "Ẩn"}
        </StatusChip>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (m) => (
        <div className="flex items-center justify-end gap-1.5">
          {!m.isChild ? (
            <button
              type="button"
              onClick={() => setPreviewMenu(m)}
              className="btn btn-outline btn-sm py-1 px-2 text-xs gap-1"
              title="Xem chi tiết và quản lý submenu"
            >
              <IconEye width={12} height={12} /> Xem
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => openEditModal(m)}
            className="btn btn-outline btn-sm py-1 px-2 text-xs gap-1"
            title={m.isChild ? "Sửa thông tin submenu" : "Sửa thông tin menu"}
          >
            <IconEdit width={12} height={12} /> Sửa
          </button>
          <button
            type="button"
            onClick={() => handleDelete(m.id)}
            className="btn btn-danger btn-sm py-1 px-2 text-xs gap-1"
            title={m.isChild ? "Xóa submenu này" : "Xóa menu này"}
          >
            <IconTrash width={12} height={12} /> Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý Menu điều hướng"
        description="Tùy chỉnh danh sách liên kết hiển thị ở Header (đầu trang) và Footer (chân trang)."
        actions={
          <button type="button" onClick={openCreateModal} className="btn btn-sm gap-1.5">
            <IconPlus width={14} height={14} /> Thêm mục menu
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterPosition("all")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterPosition === "all"
                ? "bg-ink text-canvas"
                : "bg-surface text-ink-2 hover:bg-line/40 hover:text-ink"
            }`}
          >
            Tất cả ({menus.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPosition("header")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterPosition === "header"
                ? "bg-ink text-canvas"
                : "bg-surface text-ink-2 hover:bg-line/40 hover:text-ink"
            }`}
          >
            Header ({menus.filter((m) => m.position === "header").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPosition("footer")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterPosition === "footer"
                ? "bg-ink text-canvas"
                : "bg-surface text-ink-2 hover:bg-line/40 hover:text-ink"
            }`}
          >
            Footer ({menus.filter((m) => m.position === "footer").length})
          </button>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-medium text-ink-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showSubmenus}
            onChange={(e) => setShowSubmenus(e.target.checked)}
            className="rounded border-line text-accent focus:ring-accent"
          />
          <span>Trải phẳng danh sách submenu trong bảng</span>
        </label>
      </div>

      <DataTable
        columns={columns}
        rows={tableRows}
        getKey={(m) => m.id}
        loading={loading}
      />

      <Drawer
        open={Boolean(previewMenu)}
        onClose={() => setPreviewMenu(null)}
        title={previewMenu?.name || "Chi tiết menu"}
        subtitle={`Vị trí: ${previewMenu?.position === "header" ? "Header (Đầu trang)" : "Footer (Chân trang)"}`}
        width="max-w-md"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const target = previewMenu;
                setPreviewMenu(null);
                openEditModal(target);
              }}
              className="btn btn-outline btn-sm gap-1.5"
            >
              <IconEdit width={14} height={14} /> Chỉnh sửa
            </button>
            <button
              type="button"
              onClick={() => setPreviewMenu(null)}
              className="btn btn-sm"
            >
              Đóng
            </button>
          </div>
        }
      >
        {previewMenu && (
          <div className="space-y-5 text-[13px]">
            <div className="rounded-lg border border-line bg-surface p-4 space-y-3">
              <div>
                <p className="text-[11px] text-ink-3">Tên hiển thị</p>
                <p className="text-base font-bold text-ink mt-0.5">{previewMenu.name}</p>
              </div>

              <div>
                <p className="text-[11px] text-ink-3">Đường dẫn liên kết</p>
                <p className="font-mono text-xs text-accent mt-0.5">{previewMenu.link}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <p className="text-[11px] text-ink-3">Vị trí menu</p>
                  <p className="text-xs font-semibold text-ink mt-0.5 capitalize">
                    {previewMenu.position === "header" ? "Header" : "Footer"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-ink-3">Thứ tự ưu tiên</p>
                  <p className="text-xs font-semibold text-ink mt-0.5">#{previewMenu.sort_order}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-ink-3">Trạng thái</p>
                <div className="mt-1">
                  <StatusChip tone={previewMenu.status === "active" ? "success" : "neutral"}>
                    {previewMenu.status === "active" ? "Đang hiển thị" : "Đang ẩn"}
                  </StatusChip>
                </div>
              </div>

              <div className="pt-3 border-t border-line">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-semibold text-ink">
                    Danh sách Submenu ({Array.isArray(previewMenu.children) ? previewMenu.children.length : 0})
                  </p>
                  <button
                    type="button"
                    onClick={() => openCreateModal(previewMenu.id)}
                    className="btn btn-outline btn-sm py-1 px-2 text-[11px] gap-1 text-accent border-accent/40 hover:bg-accent/10"
                  >
                    <IconPlus width={12} height={12} /> Thêm Submenu
                  </button>
                </div>

                {Array.isArray(previewMenu.children) && previewMenu.children.length > 0 ? (
                  <div className="space-y-2">
                    {previewMenu.children.map((child, idx) => (
                      <div
                        key={child.id || idx}
                        className="rounded-lg border border-line bg-surface-2 p-3 text-xs space-y-2 transition-all hover:border-line-strong"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-ink truncate">{child.name}</p>
                            <p className="font-mono text-[11px] text-accent truncate mt-0.5">{child.link}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditModal(child)}
                              className="btn btn-outline btn-sm py-0.5 px-2 text-[11px] gap-1"
                              title="Chỉnh sửa submenu này"
                            >
                              <IconEdit width={11} height={11} /> Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(child.id)}
                              className="btn btn-danger btn-sm py-0.5 px-2 text-[11px] gap-1"
                              title="Xóa submenu này"
                            >
                              <IconTrash width={11} height={11} /> Xóa
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-line/60 text-[11px] text-ink-3">
                          <span>Thứ tự: <strong className="text-ink">{child.sort_order ?? 0}</strong></span>
                          <span>•</span>
                          <StatusChip tone={child.status === "active" ? "success" : "neutral"}>
                            {child.status === "active" ? "Hiển thị" : "Ẩn"}
                          </StatusChip>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-3 italic py-2">
                    Chưa có submenu nào. Nhấn nút &quot;Thêm Submenu&quot; để tạo menu thả xuống cho mục này.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={previewMenu.link}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                <span>Kiểm tra liên kết này trên website</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMenu ? "Chỉnh sửa mục menu" : "Thêm mục menu mới"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Tên hiển thị menu *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="field"
              placeholder="Ví dụ: Váy cưới, Tin tức, Giới thiệu..."
            />
          </div>

          <div>
            <label className="field-label">Đường dẫn liên kết (Link) *</label>
            <input
              type="text"
              required
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="field font-mono text-xs"
              placeholder="/products?category=vay-cuoi hoặc /news..."
            />
          </div>

          <div>
            <label className="field-label">Menu cha (Để tạo submenu)</label>
            <select
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
              className="field"
            >
              <option value="">-- Là menu chính (Gốc) --</option>
              {menus
                .filter(
                  (p) =>
                    !p.parent_id &&
                    (!editingMenu || p.id !== editingMenu.id) &&
                    p.position === formData.position
                )
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.link})
                  </option>
                ))}
            </select>
            <p className="mt-1 text-[11px] text-ink-3">Chọn menu cha nếu bạn muốn mục này trở thành menu con (submenu) thả xuống.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Vị trí hiển thị *</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="field"
              >
                <option value="header">Header (Đầu trang)</option>
                <option value="footer">Footer (Chân trang)</option>
              </select>
            </div>

            <div>
              <label className="field-label">Thứ tự hiển thị</label>
              <input
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                className="field"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="field"
            >
              <option value="active">Hiển thị (Hoạt động)</option>
              <option value="hidden">Ẩn</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-line">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Hủy
            </button>
            <button type="submit" disabled={submitting} className="btn btn-sm">
              {submitting ? "Đang lưu..." : "Lưu menu"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
