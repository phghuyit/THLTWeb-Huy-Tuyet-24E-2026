"use client";

import { useEffect, useState } from "react";
import { contactService } from "@/services/contactService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Overlay";
import { StatusChip } from "@/components/ui/Primitives";
import { IconEye, IconMail, IconPhone, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/date";

export default function AdminContactsPage() {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [previewContact, setPreviewContact] = useState(null);
  const [editStatus, setEditStatus] = useState("pending");
  const [editReplyNote, setEditReplyNote] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await contactService.getAdminContacts({
        status: filterStatus !== "all" ? filterStatus : undefined,
        search: search.trim() || undefined,
        per_page: 50,
      });

      let list = [];
      if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res)) {
        list = res;
      }
      setContacts(list);
    } catch (err) {
      console.error("Lỗi khi tải danh sách liên hệ:", err);
      toast.push({ tone: "danger", title: "Không thể tải danh sách liên hệ." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await contactService.getContacts({
          status: filterStatus === "all" ? undefined : filterStatus,
          per_page: 50,
        });

        let list = [];
        if (Array.isArray(res?.data?.data)) {
          list = res.data.data;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (Array.isArray(res)) {
          list = res;
        }
        if (active) setContacts(list);
      } catch (err) {
        console.error("Lỗi khi tải danh sách liên hệ:", err);
        if (active) toast.push({ tone: "danger", title: "Không thể tải danh sách liên hệ." });
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchList();
    return () => {
      active = false;
    };
  }, [filterStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const openPreview = async (item) => {
    setPreviewContact(item);
    setEditStatus(item.status || "pending");
    setEditReplyNote(item.reply_note || "");

    if (item.status === "pending") {
      try {
        await contactService.updateContact(item.id, {
          status: "read",
          reply_note: item.reply_note || null,
        });
        setEditStatus("read");
        setPreviewContact({ ...item, status: "read" });
        setContacts((prev) =>
          prev.map((c) => (c.id === item.id ? { ...c, status: "read" } : c))
        );
      } catch {
      }
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!previewContact) return;

    setSubmitting(true);
    try {
      const res = await contactService.updateContact(previewContact.id, {
        status: editStatus,
        reply_note: editReplyNote.trim() || null,
      });

      const updated = res?.data || {
        ...previewContact,
        status: editStatus,
        reply_note: editReplyNote.trim() || null,
      };

      setPreviewContact(updated);
      setContacts((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      toast.push({ tone: "success", title: "Cập nhật yêu cầu hỗ trợ thành công!" });
    } catch (err) {
      toast.push({
        tone: "danger",
        title: err.response?.data?.message || "Không thể cập nhật trạng thái.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn chuyển yêu cầu này vào thùng rác?")) {
      try {
        await contactService.deleteContact(id);
        toast.push({ tone: "success", title: "Đã chuyển yêu cầu vào thùng rác." });
        if (previewContact?.id === id) {
          setPreviewContact(null);
        }
        await loadData();
      } catch (err) {
        toast.push({ tone: "danger", title: "Không thể xóa yêu cầu này." });
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <StatusChip tone="warning">Chờ xử lý</StatusChip>;
      case "read":
        return <StatusChip tone="neutral">Đã đọc</StatusChip>;
      case "replied":
        return <StatusChip tone="success">Đã phản hồi</StatusChip>;
      default:
        return <StatusChip tone="neutral">{status}</StatusChip>;
    }
  };

  const columns = [
    {
      key: "sender",
      header: "Người gửi",
      sortValue: (c) => c.name,
      render: (c) => (
        <div>
          <p className="font-semibold text-ink text-sm">{c.name}</p>
          <p className="text-[11px] text-ink-3 mt-0.5">
            {c.created_at ? formatDate(c.created_at) : "Mới gửi"}
          </p>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Thông tin liên lạc",
      render: (c) => (
        <div className="space-y-0.5 text-xs">
          <p className="font-medium text-ink flex items-center gap-1.5">
            <IconPhone width={12} height={12} className="text-accent shrink-0" />
            <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a>
          </p>
          {c.email && (
            <p className="text-ink-3 text-[11.5px] flex items-center gap-1.5">
              <IconMail width={12} height={12} className="text-ink-3 shrink-0" />
              <a href={`mailto:${c.email}`} className="hover:underline truncate max-w-[200px]">{c.email}</a>
            </p>
          )}
        </div>
      ),
    },
    {
      key: "subject",
      header: "Chủ đề & Nội dung",
      render: (c) => (
        <div className="max-w-[320px]">
          <span className="rounded bg-warm px-2 py-0.5 text-[11px] font-semibold text-ink border border-line">
            {c.subject || "Yêu cầu chung"}
          </span>
          <p className="text-xs text-ink-2 truncate mt-1" title={c.message}>
            {c.message}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (c) => getStatusBadge(c.status),
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => openPreview(c)}
            className="btn btn-outline btn-sm py-1 px-2 text-xs gap-1"
            title="Xem chi tiết"
          >
            <IconEye width={12} height={12} /> Xem
          </button>
          <button
            type="button"
            onClick={() => handleDelete(c.id)}
            className="btn btn-danger btn-sm py-1 px-2 text-xs gap-1"
            title="Xóa vào thùng rác"
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
        title="Quản lý Liên hệ & Yêu cầu hỗ trợ"
        description="Theo dõi danh sách khách hàng gửi yêu cầu tư vấn, giải đáp thắc mắc và đặt lịch thử đồ."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "Tất cả" },
            { id: "pending", label: "Chờ xử lý" },
            { id: "read", label: "Đã đọc" },
            { id: "replied", label: "Đã phản hồi" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus === tab.id
                  ? "bg-ink text-canvas"
                  : "bg-surface text-ink-2 hover:bg-line/40 hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field text-xs py-1.5 w-60"
          />
          <button type="submit" className="btn btn-sm text-xs">
            Tìm
          </button>
        </form>
      </div>

      <DataTable
        columns={columns}
        rows={contacts}
        getKey={(c) => c.id}
        loading={loading}
      />

      <Drawer
        open={Boolean(previewContact)}
        onClose={() => setPreviewContact(null)}
        title="Chi tiết yêu cầu hỗ trợ"
        subtitle={`Mã yêu cầu: #${previewContact?.id || ""}`}
        width="max-w-lg"
      >
        {previewContact && (
          <div className="space-y-6 text-[13px]">
            <div className="rounded-lg border border-line bg-surface p-4 space-y-3">
              <div>
                <p className="text-[11px] text-ink-3">Khách hàng</p>
                <p className="text-base font-bold text-ink mt-0.5">{previewContact.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="text-[11px] text-ink-3">Số điện thoại</p>
                  <a
                    href={`tel:${previewContact.phone}`}
                    className="text-xs font-semibold text-accent hover:underline mt-0.5 block"
                  >
                    {previewContact.phone}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] text-ink-3">Email</p>
                  <p className="text-xs font-medium text-ink mt-0.5">
                    {previewContact.email || "Không cung cấp"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-ink-3">Chủ đề yêu cầu</p>
                <p className="text-xs font-semibold text-ink mt-0.5">
                  {previewContact.subject || "Tư vấn chung"}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-ink-3">Thời gian gửi</p>
                <p className="text-xs text-ink-2 mt-0.5">
                  {previewContact.created_at || "Vừa xong"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-surface-2 p-4">
              <p className="text-xs font-semibold text-ink mb-1.5">Nội dung tin nhắn:</p>
              <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap bg-surface p-3 rounded border border-line/60">
                {previewContact.message}
              </p>
            </div>

            <form onSubmit={handleUpdateStatus} className="rounded-lg border border-line bg-surface p-4 space-y-4">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                Xử lý & Cập nhật trạng thái
              </h4>

              <div>
                <label className="field-label">Trạng thái yêu cầu</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="field text-xs"
                >
                  <option value="pending">Chờ xử lý (Pending)</option>
                  <option value="read">Đã đọc / Đang chuẩn bị (Read)</option>
                  <option value="replied">Đã phản hồi / Hoàn thành (Replied)</option>
                </select>
              </div>

              <div>
                <label className="field-label">Ghi chú phản hồi của Admin</label>
                <textarea
                  rows={3}
                  value={editReplyNote}
                  onChange={(e) => setEditReplyNote(e.target.value)}
                  placeholder="Ghi chú kết quả tư vấn, lịch hẹn thử đồ hoặc cuộc gọi..."
                  className="field text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => handleDelete(previewContact.id)}
                  className="btn btn-danger btn-sm text-xs gap-1"
                >
                  <IconTrash width={12} height={12} /> Chuyển thùng rác
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-sm text-xs"
                >
                  {submitting ? "Đang lưu..." : "Lưu cập nhật"}
                </button>
              </div>
            </form>
          </div>
        )}
      </Drawer>
    </div>
  );
}
