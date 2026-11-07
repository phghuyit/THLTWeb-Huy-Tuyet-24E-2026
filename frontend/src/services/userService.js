import api from "./api";

export const userService = {
  async getUsers(params = {}) {
    try {
      const res = await api.get("/admin/users", { params });
      const raw = res.data?.data;
      let users = [];
      if (Array.isArray(raw)) {
        users = raw;
      } else if (raw && Array.isArray(raw.data)) {
        users = raw.data;
      } else if (Array.isArray(res.data)) {
        users = res.data;
      }
      return {
        users,
        pagination: res.data?.pagination || null,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { users: [], pagination: null };
    }
  },

  async getUser(id) {
    try {
      const res = await api.get(`/admin/users/${id}`);
      return res.data.data || res.data;
    } catch (error) {
      console.error("Error fetching user detail:", error);
      return null;
    }
  },

  async createUser(payload) {
    const res = await api.post("/admin/users", payload);
    return res.data.data || res.data;
  },

  async updateUser(id, payload) {
    const res = await api.patch(`/admin/users/${id}`, payload);
    return res.data.data || res.data;
  },

  async deleteUser(id) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  async getTrashUsers() {
    try {
      const res = await api.get("/admin/users/trash");
      const data = res.data.data || res.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching trashed users:", error);
      return [];
    }
  },

  async restoreUser(id) {
    const res = await api.patch(`/admin/users/${id}/restore`);
    return res.data;
  },

  async forceDeleteUser(id) {
    const res = await api.delete(`/admin/users/${id}/force`);
    return res.data;
  },

  async getProfile() {
    const res = await api.get("/profile");
    return res.data?.data || res.data;
  },

  async updateProfile(payload) {
    const res = await api.put("/profile", payload);
    return res.data?.data || res.data;
  },

  async changePassword(payload) {
    const res = await api.put("/profile/password", payload);
    return res.data;
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await api.post("/profile/avatar", formData);
    return res.data;
  },

  async deleteAvatar() {
    const res = await api.delete("/profile/avatar");
    return res.data;
  },
};
