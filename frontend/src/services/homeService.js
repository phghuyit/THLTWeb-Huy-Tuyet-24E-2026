import api from "./api";

async function getList(path, params) {
  const response = await api.get(path, { params });
  const data = response.data.data;
  if (!Array.isArray(data)) throw new Error("Dữ liệu API không hợp lệ");
  return data;
}

export const homeService = {
  getNewArrivals() {
    return getList("/products", { per_page: 4 });
  },
  getFeaturedProducts() {
    return getList("/products", { is_featured: 1, per_page: 4 });
  },
  getSaleProducts() {
    return getList("/products", { is_sale: 1, per_page: 4 });
  },
  getCategories() {
    return getList("/categories", { has_products: 1, per_page: 6 });
  },
  getBanners(params) {
    return getList("/banners", params);
  },
};
