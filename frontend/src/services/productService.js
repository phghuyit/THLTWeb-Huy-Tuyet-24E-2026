import api from "./api";
import { PRODUCTS } from "@/data/products";

export const productService = {
  async getProducts(params = {}) {
    const products = [];
    let page = 1;
    let lastPage = 1;
    try {
      do {
        const res = await api.get("/products", { params: { ...params, per_page: 100, page } });
        const list = res.data?.data || res.data;
        if (Array.isArray(list)) {
          products.push(...list);
        }
        lastPage = res.data?.meta?.last_page || 1;
        page += 1;
      } while (page <= lastPage);

      return products.length > 0 ? products : [...PRODUCTS];
    } catch {
      return [...PRODUCTS];
    }
  },

  async getProductBySlug(slug) {
    try {
      const res = await api.get(`/products/${slug}`);
      return res.data.data || res.data;
    } catch {
      return PRODUCTS.find((p) => p.slug === slug || String(p.id) === String(slug)) || null;
    }
  },

  async createProduct(payload) {
    const res = await api.post("/admin/products", payload);
    return res.data.data || res.data;
  },

  async updateProduct(id, payload) {
    const res = await api.patch(`/admin/products/${id}`, payload);
    return res.data.data || res.data;
  },

  async deleteProduct(id) {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post("/admin/products/upload-image", formData);
    return res.data;
  },

  async getTrashProducts() {
    try {
      const res = await api.get("/admin/products/trash");
      const data = res.data.data || res.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async restoreProduct(id) {
    const res = await api.patch(`/admin/products/${id}/restore`);
    return res.data;
  },

  async forceDeleteProduct(id) {
    const res = await api.delete(`/admin/products/${id}/force`);
    return res.data;
  },

  async updateStock(id, sizes) {
    const res = await api.patch(`/admin/products/${id}/stock`, { sizes });
    return res.data?.data || res.data;
  },

  async importStock(id, payload) {
    const res = await api.post(`/admin/products/${id}/stock/import`, payload);
    return res.data;
  },

  async exportStock(id, payload) {
    const res = await api.post(`/admin/products/${id}/stock/export`, payload);
    return res.data;
  },
};
