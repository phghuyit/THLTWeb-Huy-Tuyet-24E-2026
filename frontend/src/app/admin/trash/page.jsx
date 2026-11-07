"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { brandService } from "@/services/brandService";
import { orderService } from "@/services/orderService";
import { userService } from "@/services/userService";
import { postService } from "@/services/postService";
import { menuService } from "@/services/menuService";
import { reviewService } from "@/services/reviewService";
import { contactService } from "@/services/contactService";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { OrderStatusChip } from "@/components/admin/Chips";
import { StatusChip } from "@/components/ui/Primitives";
import { IconRotateCcw, IconTrash } from "@/components/ui/Icons";
import { formatDate } from "@/lib/date";
import { formatVnd } from "@/lib/money";

export default function AdminTrashPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postCategories, setPostCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);

  const loadTrash = async () => {
    setLoading(true);
    try {
      const [oList, pList, cList, bList, uList, postList, postCatList, mList, rList, contList] = await Promise.all([
        orderService.getTrashOrders(),
        productService.getTrashProducts(),
        categoryService.getTrashCategories(),
        brandService.getTrashBrands(),
        userService.getTrashUsers(),
        postService.getTrashPosts(),
        postService.getTrashCategories(),
        menuService.getTrashMenus(),
        reviewService.getTrashReviews(),
        contactService.getTrashContacts(),
      ]);
      setOrders(Array.isArray(oList) ? oList : []);
      setProducts(Array.isArray(pList) ? pList : []);
      setCategories(Array.isArray(cList) ? cList : []);
      setBrands(Array.isArray(bList) ? bList : []);
      setUsers(Array.isArray(uList) ? uList : []);
      setPosts(Array.isArray(postList) ? postList : []);
      setPostCategories(Array.isArray(postCatList) ? postCatList : []);
      setMenus(Array.isArray(mList) ? mList : []);
      setReviews(Array.isArray(rList) ? rList : []);
      const extractedContacts = Array.isArray(contList?.data) ? contList.data : (Array.isArray(contList) ? contList : []);
      setContacts(extractedContacts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (type, id) => {
    try {
      if (type === "orders") await orderService.restoreOrder(id);
      if (type === "products") await productService.restoreProduct(id);
      if (type === "categories") await categoryService.restoreCategory(id);
      if (type === "brands") await brandService.restoreBrand(id);
      if (type === "users") await userService.restoreUser(id);
      if (type === "posts") await postService.restorePost(id);
      if (type === "postCategories") await postService.restoreCategory(id);
      if (type === "menus") await menuService.restoreMenu(id);
      if (type === "reviews") await reviewService.restoreReview(id);
      if (type === "contacts") await contactService.restoreContact(id);
      addToast({ title: "Thành công", description: "Đã khôi phục mục đã chọn", variant: "success" });
      await loadTrash();
    } catch (err) {
      addToast({
        title: "Lỗi khôi phục",
        description: err.response?.data?.message || err.message || "Không thể khôi phục mục này",
        variant: "danger",
      });
    }
  };

  const handleForceDelete = async (type, id) => {
    if (!confirm("Hành động này sẽ xóa vĩnh viễn và không thể khôi phục. Tiếp tục?")) return;
    try {
      if (type === "orders") await orderService.forceDeleteOrder(id);
      if (type === "products") await productService.forceDeleteProduct(id);
      if (type === "categories") await categoryService.forceDeleteCategory(id);
      if (type === "brands") await brandService.forceDeleteBrand(id);
      if (type === "users") await userService.forceDeleteUser(id);
      if (type === "posts") await postService.forceDeletePost(id);
      if (type === "postCategories") await postService.forceDeleteCategory(id);
      if (type === "menus") await menuService.forceDeleteMenu(id);
      if (type === "reviews") await reviewService.forceDeleteReview(id);
      if (type === "contacts") await contactService.forceDeleteContact(id);
      addToast({ title: "Thành công", description: "Đã xóa vĩnh viễn", variant: "success" });
      await loadTrash();
    } catch (err) {
      addToast({
        title: "Lỗi xóa vĩnh viễn",
        description: err.response?.data?.message || err.message || "Không thể xóa vĩnh viễn mục này",
        variant: "danger",
      });
    }
  };

  const orderColumns = [
    {
      key: "code",
      header: "Mã đơn",
      render: (o) => (
        <div>
          <p className="font-semibold text-ink">{o.code}</p>
          <p className="text-[11px] text-ink-3">{formatDate(o.createdAt?.slice(0, 10))}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Khách hàng",
      render: (o) => (
        <div>
          <p className="font-medium text-ink">{o.receiverName}</p>
          <p className="text-[11.5px] text-ink-2">{o.receiverPhone}</p>
        </div>
      ),
    },
    {
      key: "total",
      header: "Tổng tiền",
      align: "right",
      render: (o) => <span className="font-semibold text-accent">{formatVnd(o.grandTotal)}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (o) => <OrderStatusChip status={o.status || "cancelled"} />,
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (o) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleRestore("orders", o.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục đơn
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("orders", o.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const productColumns = [
    {
      key: "product",
      header: "Sản phẩm",
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.thumbnail || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=120&q=80"}
            alt={p.name}
            className="h-10 w-10 rounded object-cover opacity-75"
          />
          <div>
            <p className="font-medium text-ink">{p.name}</p>
            <p className="text-[11.5px] text-ink-3">ID: {p.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Giá thuê / ngày",
      align: "right",
      render: (p) => formatVnd(p.rental_price_per_day || 0),
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleRestore("products", p.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("products", p.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const categoryColumns = [
    {
      key: "name",
      header: "Tên danh mục",
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
            onClick={() => handleRestore("categories", c.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("categories", c.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const brandColumns = [
    {
      key: "name",
      header: "Tên thương hiệu",
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
            onClick={() => handleRestore("brands", b.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("brands", b.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const userColumns = [
    {
      key: "fullname",
      header: "Họ và tên",
      render: (u) => (
        <div>
          <p className="font-semibold text-ink">{u.fullname}</p>
          <p className="text-[11.5px] text-ink-3">{u.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Số điện thoại",
      render: (u) => <span className="font-mono text-xs text-ink-2">{u.phone || "—"}</span>,
    },
    {
      key: "role",
      header: "Vai trò",
      render: (u) => (
        <span className="text-[11.5px] text-ink-2">
          {u.role === "admin" ? "Quản trị viên" : "Thành viên"}
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
            onClick={() => handleRestore("users", u.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("users", u.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const postColumns = [
    {
      key: "title",
      header: "Bài viết",
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.thumbnail || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&auto=format&fit=crop&q=80"}
            alt={p.title}
            className="h-10 w-10 rounded object-cover opacity-75"
          />
          <div>
            <p className="font-medium text-ink line-clamp-1">{p.title}</p>
            <p className="text-[11.5px] text-ink-3">{p.slug}</p>
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
      key: "author",
      header: "Tác giả",
      render: (p) => p.author?.fullname || "Ban biên tập",
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleRestore("posts", p.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("posts", p.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const postCategoryColumns = [
    {
      key: "name",
      header: "Tên danh mục",
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
            onClick={() => handleRestore("postCategories", c.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("postCategories", c.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const menuColumns = [
    {
      key: "name",
      header: "Tên menu",
      render: (m) => (
        <div>
          <span className="font-semibold text-ink">{m.name}</span>
          <p className="text-[11.5px] font-mono text-ink-3">{m.link}</p>
        </div>
      ),
    },
    {
      key: "position",
      header: "Vị trí",
      render: (m) => (
        <StatusChip tone={m.position === "header" ? "info" : "neutral"}>
          {m.position === "header" ? "Header" : "Footer"}
        </StatusChip>
      ),
    },
    {
      key: "parent",
      header: "Menu cha",
      render: (m) => m.parent?.name || "Menu gốc",
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (m) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleRestore("menus", m.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("menus", m.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const reviewColumns = [
    {
      key: "author",
      header: "Người đánh giá",
      render: (r) => (
        <div>
          <span className="font-semibold text-ink">{r.author_name}</span>
          <div className="flex items-center gap-1 text-[11.5px] text-accent">
            {"★".repeat(r.rating || 5)}{"☆".repeat(Math.max(0, 5 - (r.rating || 5)))}
          </div>
        </div>
      ),
    },
    {
      key: "product",
      header: "Sản phẩm",
      render: (r) => r.product?.name || `Sản phẩm #${r.product_id}`,
    },
    {
      key: "content",
      header: "Nội dung",
      render: (r) => <p className="text-[12.5px] text-ink-2 line-clamp-2">{r.content}</p>,
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleRestore("reviews", r.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("reviews", r.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const contactColumns = [
    {
      key: "name",
      header: "Khách hàng",
      render: (c) => (
        <div>
          <span className="font-semibold text-ink">{c.name}</span>
          <p className="text-xs text-ink-3 mt-0.5">{c.phone} · {c.email || "—"}</p>
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
      key: "deleted_at",
      header: "Ngày xóa",
      render: (c) => <span className="text-xs text-ink-3">{c.deleted_at ? formatDate(c.deleted_at) : "—"}</span>,
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleRestore("contacts", c.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("contacts", c.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Thùng rác hệ thống"
        description="Khôi phục hoặc xóa vĩnh viễn đơn hủy, sản phẩm, danh mục, thương hiệu, tài khoản, bài viết, menu và đánh giá đã xóa."
      />

      <div className="mb-4 flex flex-wrap gap-2 border-b border-line pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "orders"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Đơn đã hủy ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "products"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Sản phẩm ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "categories"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Danh mục SP ({categories.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("brands")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "brands"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Thương hiệu ({brands.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "users"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Tài khoản ({users.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "posts"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Bài viết ({posts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("postCategories")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "postCategories"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Danh mục bài viết ({postCategories.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("menus")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "menus"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Menu ({menus.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "reviews"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Đánh giá ({reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("contacts")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "contacts"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Liên hệ / Hỗ trợ ({contacts.length})
        </button>
      </div>

      {activeTab === "orders" && (
        <DataTable
          columns={orderColumns}
          rows={orders}
          getKey={(o) => o.code || o.id}
          loading={loading}
          emptyText="Thùng rác đơn hàng trống."
        />
      )}

      {activeTab === "products" && (
        <DataTable
          columns={productColumns}
          rows={products}
          getKey={(p) => p.id}
          loading={loading}
          emptyText="Thùng rác sản phẩm trống."
        />
      )}

      {activeTab === "categories" && (
        <DataTable
          columns={categoryColumns}
          rows={categories}
          getKey={(c) => c.id || c.slug}
          loading={loading}
          emptyText="Thùng rác danh mục sản phẩm trống."
        />
      )}

      {activeTab === "brands" && (
        <DataTable
          columns={brandColumns}
          rows={brands}
          getKey={(b) => b.id || b.slug}
          loading={loading}
          emptyText="Thùng rác thương hiệu trống."
        />
      )}

      {activeTab === "users" && (
        <DataTable
          columns={userColumns}
          rows={users}
          getKey={(u) => u.id}
          loading={loading}
          emptyText="Thùng rác tài khoản trống."
        />
      )}

      {activeTab === "posts" && (
        <DataTable
          columns={postColumns}
          rows={posts}
          getKey={(p) => p.id}
          loading={loading}
          emptyText="Thùng rác bài viết trống."
        />
      )}

      {activeTab === "postCategories" && (
        <DataTable
          columns={postCategoryColumns}
          rows={postCategories}
          getKey={(c) => c.id || c.slug}
          loading={loading}
          emptyText="Thùng rác danh mục bài viết trống."
        />
      )}

      {activeTab === "menus" && (
        <DataTable
          columns={menuColumns}
          rows={menus}
          getKey={(m) => m.id}
          loading={loading}
          emptyText="Thùng rác menu trống."
        />
      )}

      {activeTab === "reviews" && (
        <DataTable
          columns={reviewColumns}
          rows={reviews}
          getKey={(r) => r.id}
          loading={loading}
          emptyText="Thùng rác đánh giá trống."
        />
      )}

      {activeTab === "contacts" && (
        <DataTable
          columns={contactColumns}
          rows={contacts}
          getKey={(c) => c.id}
          loading={loading}
          emptyText="Thùng rác yêu cầu liên hệ / hỗ trợ trống."
        />
      )}
    </div>
  );
}
