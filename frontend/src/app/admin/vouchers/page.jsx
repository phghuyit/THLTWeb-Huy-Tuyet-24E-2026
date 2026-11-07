"use client";

import { useEffect, useState } from "react";
import { voucherService } from "@/services/voucherService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Overlay";
import { IconEdit, IconPlus, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";
import { formatVnd } from "@/lib/money";

export default function AdminVouchersPage() {
  const toast = useToast();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    discount_amount: 50000,
    min_order_amount: 300000,
    status: "active",
  });

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const res = await voucherService.getAdminVouchers();
      let list = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      }
      setVouchers(list);
    } catch (err) {
      console.error("Lỗi tải vouchers:", err);
      toast.push({ tone: "danger", title: "Không thể tải danh sách voucher." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const openCreateModal = () => {
    setEditingVoucher(null);
    setFormData({
      code: "",
      name: "",
      discount_amount: 50000,
      min_order_amount: 300000,
      status: "active",
    });
    setModalOpen(true);
  };

  const openEditModal = (v) => {
    setEditingVoucher(v);
    setFormData({
      code: v.code || "",
      name: v.name || "",
      discount_amount: v.discount_amount || 0,
      min_order_amount: v.min_order_amount || 0,
      status: v.status || "active",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập mã giảm giá." });
      return;
    }
    if (!formData.name.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập tên chương trình." });
      return;
    }
    if (Number(formData.discount_amount) <= 0) {
      toast.push({ tone: "danger", title: "Số tiền giảm phải lớn hơn 0." });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        discount_amount: Number(formData.discount_amount),
        min_order_amount: Number(formData.min_order_amount || 0),
        status: formData.status,
      };

      if (editingVoucher) {
        await voucherService.updateVoucher(editingVoucher.id, payload);
        toast.push({ tone: "success", title: "Cập nhật mã giảm giá thành công!" });
      } else {
        await voucherService.createVoucher(payload);
        toast.push({ tone: "success", title: "Tạo mã giảm giá mới thành công!" });
      }
      setModalOpen(false);
      loadVouchers();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.code?.[0] || "Đã xảy ra lỗi khi lưu mã.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa mã "${code}"?`)) return;
    try {
      await voucherService.deleteVoucher(id);
      toast.push({ tone: "success", title: `Đã xóa mã giảm giá ${code}` });
      loadVouchers();
    } catch {
      toast.push({ tone: "danger", title: "Xóa mã thất bại." });
    }
  };

  const columns = [
    {
      key: "code",
      header: "Mã Voucher",
      render: (v) => (
        <span className="font-mono font-bold text-xs uppercase px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
          {v.code}
        </span>
      ),
    },
    {
      key: "name",
      header: "Tên chương trình",
      render: (v) => <span className="font-medium text-ink">{v.name}</span>,
    },
    {
      key: "discount_amount",
      header: "Mức giảm",
      render: (v) => (
        <span className="font-semibold text-emerald-600">
          -{formatVnd(v.discount_amount)}
        </span>
      ),
    },
    {
      key: "min_order_amount",
      header: "Đơn tối thiểu",
      render: (v) => (
        <span className="text-ink-2">
          {v.min_order_amount > 0 ? formatVnd(v.min_order_amount) : "Không yêu cầu"}
        </span>
      ),
    },
    {
      key: "used_count",
      header: "Lượt dùng",
      render: (v) => <span className="font-mono text-ink-3">{v.used_count || 0}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (v) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
            v.status === "active"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
        >
          {v.status === "active" ? "Đang áp dụng" : "Tạm tắt"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (v) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => openEditModal(v)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconEdit width={13} height={13} /> Sửa
          </button>
          <button
            type="button"
            onClick={() => handleDelete(v.id, v.code)}
            className="btn btn-outline btn-sm text-danger hover:border-danger hover:bg-danger/10 gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý mã giảm giá"
        description="Thiết lập các mã voucher giảm giá trực tiếp theo giá trị đơn hàng tối thiểu."
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="btn btn-sm gap-1.5"
          >
            <IconPlus width={14} height={14} /> Thêm mã voucher
          </button>
        }
      />

      <DataTable
        columns={columns}
        rows={vouchers}
        data={vouchers}
        getKey={(v) => v.id || v.code}
        loading={loading}
        emptyTitle="Chưa có mã giảm giá nào"
        emptyDescription="Bấm nút 'Thêm mã voucher' bên trên để tạo mã ưu đãi đầu tiên."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingVoucher ? "Chỉnh sửa mã voucher" : "Tạo mã voucher mới"}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="field-label">
              Mã voucher <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: GIAM50K, TET2026"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
              }
              className="field font-mono uppercase"
            />
          </div>

          <div>
            <label className="field-label">
              Tên chương trình <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Giảm 50.000đ cho đơn thuê từ 300.000đ"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">
                Mức giảm (VNĐ) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                required
                min={1000}
                step={5000}
                placeholder="50000"
                value={formData.discount_amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, discount_amount: e.target.value }))
                }
                className="field font-mono"
              />
            </div>

            <div>
              <label className="field-label">
                Đơn hàng tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                min={0}
                step={10000}
                placeholder="300000"
                value={formData.min_order_amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, min_order_amount: e.target.value }))
                }
                className="field font-mono"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="field"
            >
              <option value="active">Đang áp dụng (Kích hoạt)</option>
              <option value="inactive">Tạm tắt (Ngừng áp dụng)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-line">
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
              className="btn btn-sm"
            >
              {submitting ? "Đang lưu..." : editingVoucher ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
