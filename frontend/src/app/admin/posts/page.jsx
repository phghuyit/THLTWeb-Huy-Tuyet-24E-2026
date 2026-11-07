"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { postService } from "@/services/postService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { StatusChip } from "@/components/ui/Primitives";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/date";

export default function AdminPostsPage() {
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    thumbnail: "",
    summary: "",
    content: "",
    is_hot: false,
    status: "published",
  });

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const titleMatch = p.title?.toLowerCase().includes(query);
        const summaryMatch = p.summary?.toLowerCase().includes(query);
        const slugMatch = p.slug?.toLowerCase().includes(query);
        if (!titleMatch && !summaryMatch && !slugMatch) return false;
      }

      if (selectedCategory !== "all") {
        const catId = p.category_id || p.category?.id;
        const catSlug = p.category?.slug;
        if (String(catId) !== String(selectedCategory) && catSlug !== selectedCategory) {
          return false;
        }
      }

      if (selectedStatus === "hot" && !p.is_hot) return false;
      if (selectedStatus === "published" && p.status !== "published") return false;
      if (selectedStatus === "draft" && p.status !== "draft") return false;

      return true;
    });
  }, [posts, search, selectedCategory, selectedStatus]);

  const hasActiveFilters = search.trim() !== "" || selectedCategory !== "all" || selectedStatus !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  const loadData = async () => {
    try {
      const [postsList, catsList] = await Promise.all([
        postService.getAdminPosts(),
        postService.getCategories(),
      ]);
      setPosts(postsList);
      setCategories(catsList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      category_id: categories[0]?.id || "1",
      thumbnail: "",
      summary: "",
      content: "",
      is_hot: false,
      status: "published",
    });
    setModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      category_id: post.category_id || post.category?.id || categories[0]?.id || "1",
      thumbnail: post.thumbnail || "",
      summary: post.summary || "",
      content: post.content || "",
      is_hot: Boolean(post.is_hot),
      status: post.status || "published",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập tiêu đề và nội dung bài viết." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        category_id: parseInt(formData.category_id, 10) || 1,
        thumbnail: formData.thumbnail.trim() || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
        summary: formData.summary.trim() || null,
        content: formData.content.trim(),
        is_hot: Boolean(formData.is_hot),
        status: formData.status || "published",
      };

      if (!editingPost) {
        await postService.createPost(payload);
        toast.push({ tone: "success", title: "Tạo bài viết mới thành công!" });
      } else {
        await postService.updatePost(editingPost.id, payload);
        toast.push({ tone: "success", title: "Cập nhật bài viết thành công!" });
      }

      setModalOpen(false);
      await loadData();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.title?.[0] ||
        err.response?.data?.message ||
        "Không thể lưu bài viết. Vui lòng kiểm tra lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await postService.deletePost(id);
        toast.push({ tone: "success", title: "Đã xóa bài viết." });
        await loadData();
      } catch (err) {
        toast.push({ tone: "danger", title: "Không thể xóa bài viết." });
      }
    }
  };

  const columns = [
    {
      key: "title",
      header: "Bài viết",
      sortValue: (p) => p.title,
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.thumbnail || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&auto=format&fit=crop&q=80"}
            alt={p.title}
            className="h-10 w-14 rounded object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="font-medium text-ink line-clamp-1 max-w-sm">{p.title}</p>
            <p className="text-[11.5px] text-ink-3">
              {p.author?.fullname || "StyleRent"} · {p.views || 0} lượt xem
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Chuyên mục",
      render: (p) => p.category?.name || "Tin tức",
    },
    {
      key: "is_hot",
      header: "Nổi bật",
      render: (p) => (
        <StatusChip tone={p.is_hot ? "warning" : "neutral"}>
          {p.is_hot ? "Nổi bật" : "Thường"}
        </StatusChip>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (p) => (
        <StatusChip tone={p.status === "published" ? "success" : "neutral"}>
          {p.status === "published" ? "Đã đăng" : "Bản nháp"}
        </StatusChip>
      ),
    },
    {
      key: "created_at",
      header: "Ngày tạo",
      render: (p) => formatDate(p.created_at?.slice(0, 10)),
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPreviewPost(p)}
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
        title="Quản lý bài viết & Tin tức"
        description="Đăng bài xu hướng, cẩm nang phối đồ và các thông báo khuyến mãi."
        actions={
          <button type="button" onClick={openCreateModal} className="btn btn-sm gap-1.5">
            <IconPlus width={14} height={14} /> Thêm bài viết mới
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
              placeholder="Tìm theo tiêu đề, tóm tắt, slug..."
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
            <option value="all">Tất cả chuyên mục ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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
            <option value="hot">Bài viết nổi bật</option>
            <option value="published">Đã đăng</option>
            <option value="draft">Bản nháp</option>
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
          Tìm thấy <span className="font-semibold text-ink">{filteredPosts.length}</span> bài viết
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredPosts}
        getKey={(p) => p.id}
        loading={loading}
      />

      <Drawer
        open={Boolean(previewPost)}
        onClose={() => setPreviewPost(null)}
        title={previewPost?.title || "Chi tiết bài viết"}
        subtitle={`Chuyên mục: ${previewPost?.category?.name || "Tin tức"}`}
        width="max-w-lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const target = previewPost;
                setPreviewPost(null);
                openEditModal(target);
              }}
              className="btn btn-outline btn-sm gap-1.5"
            >
              <IconEdit width={14} height={14} /> Chỉnh sửa
            </button>
            <button
              type="button"
              onClick={() => setPreviewPost(null)}
              className="btn btn-sm"
            >
              Đóng
            </button>
          </div>
        }
      >
        {previewPost && (
          <div className="space-y-5 text-[13px]">
            {previewPost.thumbnail && (
              <div className="overflow-hidden rounded-lg border border-line bg-surface">
                <img
                  src={previewPost.thumbnail}
                  alt={previewPost.title}
                  className="h-56 w-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-warm px-2 py-0.5 text-xs font-medium text-ink">
                {previewPost.category?.name || "Tin tức"}
              </span>
              <StatusChip tone={previewPost.status === "published" ? "success" : "neutral"}>
                {previewPost.status === "published" ? "Đã đăng công khai" : "Bản nháp"}
              </StatusChip>
              {previewPost.is_hot && (
                <StatusChip tone="warning">Bài viết nổi bật</StatusChip>
              )}
            </div>

            <div className="rounded-lg border border-line bg-surface p-4 space-y-2">
              <p className="text-[11px] text-ink-3">
                Ngày đăng: {formatDate(previewPost.created_at?.slice(0, 10))} · Tác giả: {previewPost.author?.fullname || "StyleRent"}
              </p>
              <h3 className="font-serif text-lg font-bold text-ink">
                {previewPost.title}
              </h3>
              {previewPost.summary && (
                <p className="text-xs text-ink-2 italic border-l-2 border-accent pl-3 mt-2 leading-relaxed">
                  {previewPost.summary}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-line bg-surface p-4">
              <h4 className="text-xs font-semibold text-ink mb-2">Nội dung chi tiết</h4>
              <div
                dangerouslySetInnerHTML={{ __html: previewPost.content }}
                className="text-xs text-ink-2 leading-relaxed space-y-2"
              />
            </div>

            {previewPost.slug && (
              <div className="pt-2">
                <Link
                  href={`/news/${previewPost.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                >
                  <span>Xem bài viết trên trang khách hàng</span>
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
        title={editingPost ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
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
              form="admin-post-form"
              disabled={submitting}
              className="btn btn-sm"
            >
              {submitting ? "Đang lưu..." : "Lưu bài viết"}
            </button>
          </div>
        }
      >
        <form id="admin-post-form" onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Tiêu đề bài viết *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="field"
              placeholder="Nhập tiêu đề bài viết..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Chuyên mục *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="field"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="field"
              >
                <option value="published">Xuất bản công khai</option>
                <option value="draft">Lưu bản nháp</option>
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Link ảnh đại diện (Thumbnail URL)</label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="field"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_hot"
              checked={formData.is_hot}
              onChange={(e) => setFormData({ ...formData, is_hot: e.target.checked })}
              className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
            />
            <label htmlFor="is_hot" className="text-xs font-medium text-ink cursor-pointer">
              Đánh dấu là bài viết nổi bật (Hiển thị đầu trang tin tức)
            </label>
          </div>

          <div>
            <label className="field-label">Tóm tắt ngắn</label>
            <textarea
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="field text-xs"
              placeholder="Tóm tắt ngắn gọn 1-2 câu để thu hút người đọc..."
            />
          </div>

          <div>
            <label className="field-label">Nội dung bài viết *</label>
            <textarea
              rows={8}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="field text-xs font-mono"
              placeholder="Nhập nội dung bài viết (hỗ trợ văn bản thuần hoặc thẻ HTML như <p>, <h3>, <strong>)..."
            />
          </div>

        </form>
      </Modal>
    </div>
  );
}
