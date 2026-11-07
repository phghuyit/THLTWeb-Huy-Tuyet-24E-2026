import api from "./api";

export const dashboardService = {
  async getDashboardData() {
    try {
      const res = await api.get("/admin/dashboard");
      return res.data;
    } catch {
      return null;
    }
  },
};
