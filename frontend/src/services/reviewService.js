import api from "./api";

export const reviewService = {
  async getReviews(params = {}) {
    try {
      const res = await api.get("/reviews", { params });
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw)) {
        return raw;
      }
      return [];
    } catch {
      return [];
    }
  },

  async createReview(payload) {
    const res = await api.post("/reviews", payload);
    return res.data?.data || res.data;
  },

  async getAdminReviews(params = {}) {
    try {
      const res = await api.get("/admin/reviews", { params });
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw)) {
        return raw;
      }
      return [];
    } catch {
      return [];
    }
  },

  async updateReviewStatus(id, status) {
    const res = await api.patch(`/admin/reviews/${id}/status`, { status });
    return res.data;
  },

  async deleteReview(id) {
    const res = await api.delete(`/admin/reviews/${id}`);
    return res.data;
  },

  async getTrashReviews() {
    try {
      const res = await api.get("/admin/reviews/trash");
      const raw = res.data?.data || res.data;
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  },

  async restoreReview(id) {
    const res = await api.patch(`/admin/reviews/${id}/restore`);
    return res.data;
  },

  async forceDeleteReview(id) {
    const res = await api.delete(`/admin/reviews/${id}/force`);
    return res.data;
  },
};
