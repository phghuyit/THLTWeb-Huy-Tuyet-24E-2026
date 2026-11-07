import api from "./api";

export const authService = {
  async register(payload) {
    const response = await api.post("/register", payload);
    return response.data;
  },
  async login(payload) {
    const response = await api.post("/login", payload);
    return response.data;
  },
  async getCurrentUser() {
    const response = await api.get("/user");
    return response.data;
  },
  async logout() {
    await api.post("/logout");
  },
  async sendForgotPasswordCode(email) {
    const response = await api.post("/forgot-password/send-code", { email });
    return response.data;
  },
  async verifyForgotPasswordCode(payload) {
    const response = await api.post("/forgot-password/verify-code", payload);
    return response.data;
  },
};

export function authErrorMessage(error) {
  if (!error.response) return "Không kết nối được máy chủ. Vui lòng thử lại sau.";
  if (error.response.status === 429) return "Bạn thử quá nhiều lần. Vui lòng đợi một phút rồi thử lại.";
  if (error.response.status >= 500) return "Máy chủ đang gặp lỗi. Vui lòng thử lại sau.";
  return error.response.data?.message || "Không thực hiện được yêu cầu. Vui lòng thử lại.";
}
