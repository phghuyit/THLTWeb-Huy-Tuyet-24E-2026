import api from "./api";
import { BRANDS } from "@/data/catalog";

let mockBrands = [...BRANDS];

export const brandService = {
  async getBrands() {
    try {
      const res = await api.get("/brands", { params: { per_page: 12 } });
      const data = res.data.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return [...mockBrands];
    } catch {
      return [...mockBrands];
    }
  },

  async createBrand(payload) {
    const res = await api.post("/admin/brands", payload);
    return res.data.data || res.data;
  },

  async updateBrand(id, payload) {
    const res = await api.patch(`/admin/brands/${id}`, payload);
    return res.data.data || res.data;
  },

  async deleteBrand(id) {
    const res = await api.delete(`/admin/brands/${id}`);
    return res.data;
  },

  async getTrashBrands() {
    try {
      const res = await api.get("/admin/brands/trash");
      const data = res.data.data || res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async restoreBrand(id) {
    const res = await api.patch(`/admin/brands/${id}/restore`);
    return res.data;
  },

  async forceDeleteBrand(id) {
    const res = await api.delete(`/admin/brands/${id}/force`);
    return res.data;
  },
};
