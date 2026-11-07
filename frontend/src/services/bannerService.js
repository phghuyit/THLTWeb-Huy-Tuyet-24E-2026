import api from "./api";

export const bannerService = {
  async getBanners(params) {
    const res = await api.get("/banners", { params });
    return res.data.data || res.data || [];
  },

  async getAdminBanners() {
    const res = await api.get("/admin/banners");
    return res.data.data || res.data || [];
  },

  async getBanner(id) {
    const res = await api.get(`/admin/banners/${id}`);
    return res.data.data || res.data;
  },

  async createBanner(data) {
    const res = await api.post("/admin/banners", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return res.data;
  },

  async updateBanner(id, data) {
    const res = await api.post(`/admin/banners/${id}`, data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return res.data;
  },

  async deleteBanner(id) {
    const res = await api.delete(`/admin/banners/${id}`);
    return res.data;
  },
};
