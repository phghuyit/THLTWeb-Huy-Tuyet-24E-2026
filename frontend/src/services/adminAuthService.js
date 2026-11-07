import api from "./api";
import { clearAdminToken, saveAdminToken } from "./adminToken";

export const adminAuthService = {
  async login(payload, remember) {
    const response = await api.post("/admin/login", payload);
    saveAdminToken(response.data.token, remember);
    return response.data.data;
  },
  async getCurrentAdmin() {
    const response = await api.get("/admin/me");
    return response.data.data;
  },
  async logout() {
    try {
      await api.post("/admin/logout");
    } catch (error) {

      if (![401, 403].includes(error.response?.status)) throw error;
    }
    clearAdminToken();
  },
};
