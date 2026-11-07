import api from "./api";

export const orderService = {
  async getOrders(params = {}) {
    try {
      const res = await api.get("/admin/orders", { params });
      return res.data.data || res.data || [];
    } catch (err) {
      console.error("Lỗi gọi API /admin/orders:", err);
      return [];
    }
  },

  async getOrderByCode(code) {
    try {
      const res = await api.get(`/admin/orders/${code}`);
      return res.data.data || res.data || null;
    } catch (err) {
      console.error(`Lỗi gọi API /admin/orders/${code}:`, err);
      return null;
    }
  },

  async getMyOrders() {
    try {
      const res = await api.get("/my-orders");
      return res.data.data || res.data || [];
    } catch (err) {
      console.error("Lỗi gọi API /my-orders:", err);
      return [];
    }
  },

  async updateOrderStatus(code, status) {
    const res = await api.patch(`/admin/orders/${code}`, { status });
    return res.data.data || res.data;
  },

  async getTrashOrders() {
    try {
      const res = await api.get("/admin/orders/trash");
      return res.data.data || res.data || [];
    } catch (err) {
      console.error("Lỗi gọi API /admin/orders/trash:", err);
      return [];
    }
  },

  async restoreOrder(id) {
    const res = await api.patch(`/admin/orders/${id}/restore`);
    return res.data;
  },

  async forceDeleteOrder(id) {
    const res = await api.delete(`/admin/orders/${id}/force`);
    return res.data;
  },
};
