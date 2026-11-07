"use client";

import { useEffect, useState, useMemo } from "react";
import { userService } from "@/services/userService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Modal, Drawer } from "@/components/ui/Overlay";
import { useToast } from "@/components/ui/Toast";
import { IconEdit, IconPlus, IconUser, IconEye } from "@/components/ui/Icons";
import { OrderStatusChip } from "@/components/admin/Chips";
import { formatDate } from "@/lib/date";
import { formatVnd } from "@/lib/money";

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleViewDetail = async (user) => {
    setDetailUser(user);
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const data = await userService.getUser(user.id);
      if (data) {
        setDetailUser(data);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
    role: "member",
    status: "active",
  });

  const loadUsers = async () => {
    setLoading(true);
    const result = await userService.getUsers();
    setUsers(result.users || []);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    async function init() {
      const result = await userService.getUsers();
      if (active) {
        setUsers(result.users || []);
        setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      fullname: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone: "",
      address: "",
      role: "member",
      status: "active",
    });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      fullname: user.fullname || "",
      email: user.email || "",
      password: "",
      password_confirmation: "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "member",
      status: user.status || "active",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullname || !formData.email) {
      toast.push({ tone: "danger", title: "Vui lòng nhập đầy đủ họ tên và email." });
      return;
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        const payload = {
          fullname: formData.fullname,
          email: formData.email,
          phone: formData.phone || null,
          address: formData.address || null,
          role: formData.role,
          status: formData.status,
        };
        await userService.updateUser(editingUser.id, payload);
        toast.push({ tone: "success", title: "Cập nhật người dùng thành công!" });
      } else {
        if (!formData.password || formData.password.length < 8) {
          toast.push({ tone: "danger", title: "Mật khẩu phải từ 8 ký tự trở lên." });
          setSubmitting(false);
          return;
        }
        if (formData.password !== formData.password_confirmation) {
          toast.push({ tone: "danger", title: "Mật khẩu xác nhận không khớp." });
          setSubmitting(false);
          return;
        }

        await userService.createUser(formData);
        toast.push({ tone: "success", title: "Thêm người dùng mới thành công!" });
      }

      setModalOpen(false);
      await loadUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleBlock = async (user) => {
    const isLocked = user.status === "locked";
    const nextStatus = isLocked ? "active" : "locked";
    const confirmMessage = isLocked
      ? `Bạn có chắc chắn muốn mở khóa tài khoản ${user.fullname}?`
      : `Bạn có chắc chắn muốn khóa (block) tài khoản ${user.fullname}? Người dùng này sẽ không thể đăng nhập vào hệ thống.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await userService.updateUser(user.id, { status: nextStatus });
      toast.push({
        tone: nextStatus === "active" ? "success" : "warning",
        title: nextStatus === "active" ? "Đã mở khóa tài khoản thành công" : "Đã khóa (block) tài khoản thành công",
      });
      await loadUsers();
    } catch {
      toast.push({ tone: "danger", title: "Không thể thay đổi trạng thái tài khoản." });
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "active" ? "locked" : "active";
    try {
      await userService.updateUser(user.id, { status: nextStatus });
      toast.push({
        tone: nextStatus === "active" ? "success" : "warning",
        title: nextStatus === "active" ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản",
      });
      await loadUsers();
    } catch (err) {
      toast.push({ tone: "danger", title: "Cập nhật trạng thái thất bại." });
    }
  };

  const columns = [
    {
      key: "fullname",
      header: "Họ và tên / Email",
      sortValue: (u) => u.fullname,
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-line-2 text-ink font-semibold text-xs shrink-0">
            {u.fullname ? u.fullname.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-ink truncate text-[13px]">{u.fullname}</p>
            <p className="text-[11.5px] text-ink-3 truncate">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Liên hệ",
      render: (u) => (
        <div className="text-[12px]">
          <p className="font-mono text-ink">{u.phone || "—"}</p>
          <p className="text-ink-3 truncate max-w-[200px]">{u.address || "Chưa có địa chỉ"}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Vai trò",
      sortValue: (u) => u.role,
      render: (u) => (
        <span
          className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded ${
            u.role === "admin"
              ? "bg-ink text-white"
              : "bg-line-2 text-ink-2"
          }`}
        >
          {u.role === "admin" ? "Quản trị viên (Admin)" : "Thành viên (Member)"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (u) => {
        const isActive = u.status === "active";
        return (
          <button
            type="button"
            onClick={() => handleToggleStatus(u)}
            title="Nhấn để đổi trạng thái"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full cursor-pointer transition-colors ${
              isActive
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            {isActive ? "Hoạt động" : "Đã khóa"}
          </button>
        );
      },
    },
    {
      key: "created_at",
      header: "Ngày tham gia",
      render: (u) => (
        <span className="text-[12px] text-ink-3">
          {u.created_at ? formatDate(u.created_at.slice(0, 10)) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (u) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleViewDetail(u)}
            className="btn btn-outline btn-sm gap-1 text-xs"
          >
            <IconEye width={13} height={13} /> Xem chi tiết
          </button>
          <button
            type="button"
            onClick={() => openEditModal(u)}
            className="btn btn-outline btn-sm gap-1 text-xs"
          >
            <IconEdit width={13} height={13} /> Sửa
          </button>
          <button
            type="button"
            onClick={() => handleToggleBlock(u)}
            className={`btn btn-sm gap-1 text-xs ${
              u.status === "locked"
                ? "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                : "btn-danger"
            }`}
            title={u.status === "locked" ? "Mở khóa tài khoản" : "Khóa tài khoản (Block)"}
          >
            <svg
              width={13}
              height={13}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {u.status === "locked" ? (
                <>
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </>
              ) : (
                <>
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </>
              )}
            </svg>
            {u.status === "locked" ? "Mở khóa" : "Khóa"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý người dùng"
        description="Quản lý danh sách tài khoản thành viên và phân quyền quản trị viên."
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="btn btn-sm gap-1.5"
          >
            <IconPlus width={14} height={14} /> Thêm tài khoản
          </button>
        }
      />


      <DataTable
        columns={columns}
        rows={users}
        getKey={(u) => u.id}
        loading={loading}
      />

      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingUser ? `Chỉnh sửa tài khoản: ${editingUser.fullname}` : "Thêm người dùng mới"}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="field-label">Họ và tên *</label>
              <input
                type="text"
                required
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className="field"
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="field-label">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="field"
                placeholder="user@example.com"
              />
            </div>

            {!editingUser && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="field-label">Mật khẩu *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="field"
                    placeholder="Tối thiểu 8 ký tự"
                  />
                </div>
                <div>
                  <label className="field-label">Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="field"
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="field-label">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="field"
                  placeholder="0912 345 678"
                />
              </div>

              <div>
                <label className="field-label">Vai trò</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="field"
                >
                  <option value="member">Thành viên (Member)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Địa chỉ</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="field"
                placeholder="Số nhà, đường, quận/huyện..."
              />
            </div>

            <div>
              <label className="field-label">Trạng thái tài khoản</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="field"
              >
                <option value="active">Hoạt động (Active)</option>
                <option value="locked">Khóa (Locked)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn btn-outline text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn text-xs"
              >
                {submitting ? "Đang lưu..." : editingUser ? "Lưu thay đổi" : "Tạo tài khoản"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {detailOpen && (
        <Drawer
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          title={detailUser ? `Hồ sơ: ${detailUser.fullname}` : "Chi tiết người dùng"}
          subtitle={detailUser?.email || ""}
        >
          {detailUser && (
            <div className="space-y-6 text-[13px]">
              <div className="card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-line-2 text-ink font-bold text-base shrink-0">
                    {detailUser.fullname ? detailUser.fullname.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink text-base">{detailUser.fullname}</h3>
                    <p className="text-xs text-ink-3">{detailUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line text-xs">
                  <div>
                    <span className="text-ink-3 block">Số điện thoại</span>
                    <span className="font-mono text-ink font-medium">{detailUser.phone || "Chưa cập nhật"}</span>
                  </div>
                  <div>
                    <span className="text-ink-3 block">Vai trò</span>
                    <span className="font-medium text-ink">
                      {detailUser.role === "admin" ? "Quản trị viên (Admin)" : "Thành viên (Member)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-3 block">Trạng thái</span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        detailUser.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {detailUser.status === "active" ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-3 block">Ngày đăng ký</span>
                    <span className="text-ink">
                      {detailUser.created_at ? formatDate(detailUser.created_at.slice(0, 10)) : "—"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-ink-3 block">Địa chỉ nhận hàng</span>
                    <span className="text-ink">{detailUser.address || "Chưa có địa chỉ"}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-ink text-sm">
                    Lịch sử đơn thuê ({detailUser.orders?.length || 0} đơn)
                  </h4>
                </div>

                {detailLoading ? (
                  <p className="text-xs text-ink-3 py-6 text-center">Đang tải lịch sử đơn thuê...</p>
                ) : !detailUser.orders || detailUser.orders.length === 0 ? (
                  <div className="card p-6 text-center text-xs text-ink-3">
                    Người dùng này chưa có đơn thuê nào.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {detailUser.orders.map((order) => (
                      <div key={order.id || order.code} className="card p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-ink text-sm font-mono">#{order.code}</span>
                            {order.createdAt && (
                              <p className="text-[11px] text-ink-3 mt-0.5">
                                {formatDate(order.createdAt.slice(0, 10))}
                              </p>
                            )}
                          </div>
                          <OrderStatusChip status={order.status} />
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="divide-y divide-line border-y border-line py-2 my-2 space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 pt-2 first:pt-0">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.productNameSnapshot}
                                    className="h-10 w-8 rounded object-cover shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="truncate text-xs font-medium text-ink">
                                    {item.productNameSnapshot || "Trang phục thuê"}
                                  </p>
                                  <p className="text-[11px] text-ink-3">
                                    SL: {item.quantity || 1}
                                    {item.variantSnapshot?.size ? ` · Size ${item.variantSnapshot.size}` : ""}
                                    {item.variantSnapshot?.color ? ` · Màu ${item.variantSnapshot.color}` : ""}
                                  </p>
                                </div>
                                <span className="text-xs font-semibold text-accent">
                                  {formatVnd(item.lineRentalTotal || 0)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-ink-3">
                            {order.pickupDate
                              ? `${formatDate(order.pickupDate.slice(0, 10))} → ${formatDate(order.returnDate?.slice(0, 10))}`
                              : "Kỳ thuê"}
                          </span>
                          <span className="font-bold text-accent text-sm">
                            {formatVnd(order.grandTotal || 0)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Drawer>
      )}
    </div>
  );
}
