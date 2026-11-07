import api from "./api";

export const voucherService = {
  async getPublicVouchers() {
    const res = await api.get("/vouchers");
    return res.data;
  },

  async validateVoucher(code, orderAmount) {
    const res = await api.post("/vouchers/validate", {
      code,
      order_amount: orderAmount,
    });
    return res.data;
  },

  async getAdminVouchers(params = {}) {
    try {
      const res = await api.get("/admin/vouchers", { params });
      return res.data;
    } catch (err) {
      try {
        const fallback = await api.get("/vouchers");
        return fallback.data;
      } catch {
        throw err;
      }
    }
  },

  async createVoucher(data) {
    const res = await api.post("/admin/vouchers", data);
    return res.data;
  },

  async updateVoucher(id, data) {
    const res = await api.put(`/admin/vouchers/${id}`, data);
    return res.data;
  },

  async deleteVoucher(id) {
    const res = await api.delete(`/admin/vouchers/${id}`);
    return res.data;
  },
};
