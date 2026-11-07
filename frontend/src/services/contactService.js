import api from "./api";

export const contactService = {
  async createContact(data) {
    const res = await api.post("/contacts", data);
    return res.data;
  },

  async getAdminContacts(params = {}) {
    const res = await api.get("/admin/contacts", { params });
    return res.data;
  },

  async getContact(id) {
    const res = await api.get(`/admin/contacts/${id}`);
    return res.data;
  },

  async updateContact(id, data) {
    const res = await api.put(`/admin/contacts/${id}`, data);
    return res.data;
  },

  async deleteContact(id) {
    const res = await api.delete(`/admin/contacts/${id}`);
    return res.data;
  },

  async getTrashContacts() {
    const res = await api.get("/admin/contacts/trash");
    return res.data;
  },

  async restoreContact(id) {
    const res = await api.patch(`/admin/contacts/${id}/restore`);
    return res.data;
  },

  async forceDeleteContact(id) {
    const res = await api.delete(`/admin/contacts/${id}/force`);
    return res.data;
  },
};
