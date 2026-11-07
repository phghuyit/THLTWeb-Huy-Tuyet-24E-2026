import api from "./api";

export const cartService = {
  async getCart() {
    const response = await api.get("/cart");
    return response.data;
  },

  async addToCart(payload) {
    const response = await api.post("/cart", {
      product_id: payload.productId ?? payload.product_id,
      product_size_id: payload.productSizeId ?? payload.product_size_id ?? null,
      quantity: payload.quantity ?? 1,
      rent_start_date: payload.pickupDate ?? payload.rent_start_date ?? null,
      rent_end_date: payload.returnDate ?? payload.rent_end_date ?? null,
    });
    return response.data;
  },

  async updateCartItem(id, payload) {
    const response = await api.put(`/cart/${id}`, {
      quantity: payload.quantity,
      rent_start_date: payload.pickupDate ?? payload.rent_start_date ?? undefined,
      rent_end_date: payload.returnDate ?? payload.rent_end_date ?? undefined,
    });
    return response.data;
  },

  async removeCartItem(id) {
    const response = await api.delete(`/cart/${id}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete("/cart/clear");
    return response.data;
  },
};
