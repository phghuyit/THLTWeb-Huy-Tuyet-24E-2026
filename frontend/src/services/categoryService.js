import api from "./api";
import { CATEGORIES } from "@/data/catalog";

let mockCategories = [...CATEGORIES];

export const categoryService = {
  async getCategories() {
    try {
      const res = await api.get("/categories", { params: { per_page: 100 } });
      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return [...mockCategories];
    } catch {
      return [...mockCategories];
    }
  },

  async createCategory(payload) {
    const res = await api.post("/admin/categories", payload);
    return res.data.data || res.data;
  },

  async updateCategory(id, payload) {
    const res = await api.patch(`/admin/categories/${id}`, payload);
    return res.data.data || res.data;
  },

  async deleteCategory(id) {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  },

  async getTrashCategories() {
    try {
      const res = await api.get("/admin/categories/trash");
      const data = res.data.data || res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async restoreCategory(id) {
    const res = await api.patch(`/admin/categories/${id}/restore`);
    return res.data;
  },

  async forceDeleteCategory(id) {
    const res = await api.delete(`/admin/categories/${id}/force`);
    return res.data;
  },
};
