import api from "./api";

const FALLBACK_POSTS = [
  {
    id: 1,
    title: "Xu Hướng Thời Trang 2026: Tối Giản Nhưng Đầy Quyến Rũ",
    slug: "xu-huong-thoi-trang-2026-toi-gian-quyen-ru",
    thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    summary: "Khám phá các tông màu trung tính sang trọng và phom dáng cut-out tinh tế đang thống trị sàn diễn thời trang năm nay.",
    content: "<p>Thời trang năm 2026 chứng kiến sự trở lại mạnh mẽ của phong cách Quiet Luxury kết hợp cùng đường nét hiện đại. Những chiếc đầm lụa trơn, blazer dáng suông mềm mại hay chân váy xẻ tà tinh tế trở thành sự lựa chọn hàng đầu cho các quý cô khi tham dự sự kiện.</p><p>Tại StyleRent, chúng tôi luôn tuyển chọn những bộ sưu tập đón đầu xu hướng để bạn luôn tự tin tỏa sáng mà không cần đầu tư tủ đồ đắt đỏ.</p>",
    category: { id: 1, name: "Xu hướng thời trang", slug: "xu-huong-thoi-trang" },
    author: { fullname: "StyleRent Editorial" },
    created_at: "2026-03-15",
    views: 1420,
    is_hot: true,
    status: "published",
  },
  {
    id: 2,
    title: "Bí Quyết Chọn Đầm Dạ Hội Tôn Dáng Cho Từng Phom Người",
    slug: "bi-quyet-chon-dam-da-hoi-ton-dang",
    thumbnail: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
    summary: "Dù bạn có dáng người quả lê, đồng hồ cát hay thước kẻ, những mẹo chọn đầm này sẽ giúp bạn nổi bật trong mọi bữa tiệc.",
    content: "<p>Chọn một chiếc đầm dạ hội vừa vặn không chỉ là câu chuyện về kích thước, mà còn là sự cân đối về tỷ lệ cơ thể. Với dáng người quả lê, các mẫu đầm chữ A khoét cổ chữ V sẽ giúp phần thân trên thon gọn và hài hòa hơn.</p><p>Ngược lại, nếu bạn sở hữu dáng đồng hồ cát, đừng ngần ngại lựa chọn đầm ôm đuôi cá để tôn vinh trọn vẹn những đường cong quyến rũ.</p>",
    category: { id: 2, name: "Bí quyết phối đồ", slug: "bi-quyet-phoi-do" },
    author: { fullname: "Thu Hà - Stylist" },
    created_at: "2026-03-20",
    views: 980,
    is_hot: true,
    status: "published",
  },
  {
    id: 3,
    title: "Cẩm Nang Thuê Trang Phục: Tiết Kiệm, Sang Trọng và Tiện Lợi",
    slug: "cam-nang-thue-trang-phuc-tiet-kiem-sang-trong",
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
    summary: "Tại sao dịch vụ thuê trang phục cao cấp lại trở thành phong cách sống thông minh của phái đẹp hiện đại?",
    content: "<p>Thay vì chi hàng triệu đồng cho một bộ trang phục chỉ mặc đúng một lần trong đám cưới hoặc sự kiện công ty, việc thuê váy thiết kế cao cấp mang lại giải pháp tài chính vượt trội mà vẫn đảm bảo hình ảnh chỉn chu, mới mẻ mỗi lần xuất hiện.</p><p>Hơn nữa, dịch vụ cho thuê trang phục còn đóng góp tích cực vào xu hướng thời trang bền vững, giảm thiểu lượng rác thải dệt may ra môi trường.</p>",
    category: { id: 3, name: "Tin tức & Ưu đãi", slug: "tin-tuc-uu-dai" },
    author: { fullname: "Minh Anh" },
    created_at: "2026-03-22",
    views: 850,
    is_hot: false,
    status: "published",
  },
];

const FALLBACK_CATEGORIES = [
  { id: 1, name: "Xu hướng thời trang", slug: "xu-huong-thoi-trang" },
  { id: 2, name: "Bí quyết phối đồ", slug: "bi-quyet-phoi-do" },
  { id: 3, name: "Tin tức & Ưu đãi", slug: "tin-tuc-uu-dai" },
];

export const postService = {
  async getPosts(params = {}) {
    try {
      const res = await api.get("/posts", { params });
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw;
      }
      return FALLBACK_POSTS;
    } catch {
      return FALLBACK_POSTS;
    }
  },

  async getHotPosts() {
    try {
      const res = await api.get("/posts/hot");
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw;
      }
      return FALLBACK_POSTS.filter((p) => p.is_hot);
    } catch {
      return FALLBACK_POSTS.filter((p) => p.is_hot);
    }
  },

  async getCategories() {
    try {
      const res = await api.get("/posts/categories");
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw;
      }
      return FALLBACK_CATEGORIES;
    } catch {
      return FALLBACK_CATEGORIES;
    }
  },

  async getPostBySlug(slug) {
    try {
      const res = await api.get(`/posts/${slug}`);
      return res.data?.data || res.data;
    } catch {
      return FALLBACK_POSTS.find((p) => p.slug === slug || String(p.id) === String(slug)) || null;
    }
  },

  async getAdminPosts(params = {}) {
    try {
      const res = await api.get("/admin/posts", { params });
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw;
      }
      return FALLBACK_POSTS;
    } catch {
      return FALLBACK_POSTS;
    }
  },

  async createPost(payload) {
    const res = await api.post("/admin/posts", payload);
    return res.data?.data || res.data;
  },

  async updatePost(id, payload) {
    const res = await api.put(`/admin/posts/${id}`, payload);
    return res.data?.data || res.data;
  },

  async deletePost(id) {
    const res = await api.delete(`/admin/posts/${id}`);
    return res.data;
  },

  async createCategory(payload) {
    const res = await api.post("/admin/posts/categories", payload);
    return res.data?.data || res.data;
  },

  async updateCategory(id, payload) {
    const res = await api.put(`/admin/posts/categories/${id}`, payload);
    return res.data?.data || res.data;
  },

  async deleteCategory(id) {
    const res = await api.delete(`/admin/posts/categories/${id}`);
    return res.data;
  },

  async getTrashPosts() {
    try {
      const res = await api.get("/admin/posts/trash");
      const raw = res.data?.data || res.data;
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  },

  async restorePost(id) {
    const res = await api.patch(`/admin/posts/${id}/restore`);
    return res.data;
  },

  async forceDeletePost(id) {
    const res = await api.delete(`/admin/posts/${id}/force`);
    return res.data;
  },

  async getTrashCategories() {
    try {
      const res = await api.get("/admin/posts/categories/trash");
      const raw = res.data?.data || res.data;
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  },

  async restoreCategory(id) {
    const res = await api.patch(`/admin/posts/categories/${id}/restore`);
    return res.data;
  },

  async forceDeleteCategory(id) {
    const res = await api.delete(`/admin/posts/categories/${id}/force`);
    return res.data;
  },
};
