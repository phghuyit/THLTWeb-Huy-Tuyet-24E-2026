import api from "./api";

const DEFAULT_HEADER_MENUS = [
  { id: 1, name: "Trang chủ", link: "/", position: "header", sort_order: 1, status: "active", children: [] },
  {
    id: 2,
    name: "Sản phẩm",
    link: "/products",
    position: "header",
    sort_order: 2,
    status: "active",
    children: [
      { id: 3, name: "Áo dài", link: "/products?category=ao-dai", parent_id: 2, sort_order: 1, status: "active" },
      { id: 4, name: "Váy đầm", link: "/products?category=vay-dam", parent_id: 2, sort_order: 2, status: "active" },
      { id: 5, name: "Vest nam", link: "/products?category=vest-nam", parent_id: 2, sort_order: 3, status: "active" },
      { id: 6, name: "Váy cưới", link: "/products?category=vay-cuoi", parent_id: 2, sort_order: 4, status: "active" },
      { id: 7, name: "Phụ kiện", link: "/products?category=phu-kien", parent_id: 2, sort_order: 5, status: "active" },
    ],
  },
  { id: 8, name: "Bài viết & Xu hướng", link: "/news", position: "header", sort_order: 3, status: "active", children: [] },
  { id: 9, name: "Bảng giá & Quy định", link: "/pricing", position: "header", sort_order: 4, status: "active", children: [] },
  { id: 10, name: "Về chúng tôi", link: "/about", position: "header", sort_order: 5, status: "active", children: [] },
  { id: 11, name: "Liên hệ", link: "/contact", position: "header", sort_order: 6, status: "active", children: [] },
];

const DEFAULT_FOOTER_MENUS = [
  { id: 101, name: "Toàn bộ bộ sưu tập", link: "/products", position: "footer", sort_order: 1, status: "active" },
  { id: 102, name: "Váy cưới thiết kế", link: "/products?category=vay-cuoi", position: "footer", sort_order: 2, status: "active" },
  { id: 103, name: "Vest & Tuxedo cao cấp", link: "/products?category=vest-nam", position: "footer", sort_order: 3, status: "active" },
  { id: 104, name: "Tin tức & Cẩm nang", link: "/news", position: "footer", sort_order: 4, status: "active" },
  { id: 105, name: "Hướng dẫn thuê đồ", link: "/news", position: "footer", sort_order: 5, status: "active" },
];

export const menuService = {
  async getMenus(position = "header") {
    try {
      const res = await api.get("/menus", { params: { position } });
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw;
      }
      return position === "header" ? DEFAULT_HEADER_MENUS : DEFAULT_FOOTER_MENUS;
    } catch {
      return position === "header" ? DEFAULT_HEADER_MENUS : DEFAULT_FOOTER_MENUS;
    }
  },

  async getAdminMenus(params = {}) {
    try {
      const res = await api.get("/admin/menus", { params });
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw;
      }
      return [...DEFAULT_HEADER_MENUS, ...DEFAULT_FOOTER_MENUS];
    } catch {
      return [...DEFAULT_HEADER_MENUS, ...DEFAULT_FOOTER_MENUS];
    }
  },

  async getMenu(id) {
    try {
      const res = await api.get(`/admin/menus/${id}`);
      return res.data?.data || res.data;
    } catch {
      return null;
    }
  },

  async createMenu(payload) {
    const res = await api.post("/admin/menus", payload);
    return res.data?.data || res.data;
  },

  async updateMenu(id, payload) {
    const res = await api.put(`/admin/menus/${id}`, payload);
    return res.data?.data || res.data;
  },

  async deleteMenu(id) {
    const res = await api.delete(`/admin/menus/${id}`);
    return res.data;
  },

  async getTrashMenus() {
    try {
      const res = await api.get("/admin/menus/trash");
      const raw = res.data?.data || res.data;
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  },

  async restoreMenu(id) {
    const res = await api.patch(`/admin/menus/${id}/restore`);
    return res.data;
  },

  async forceDeleteMenu(id) {
    const res = await api.delete(`/admin/menus/${id}/force`);
    return res.data;
  },
};
