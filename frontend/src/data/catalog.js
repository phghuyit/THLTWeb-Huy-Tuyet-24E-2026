export const CATEGORIES = [
  {
    id: 1,
    slug: "ao-dai",
    name: "Áo dài",
    description: "Áo dài truyền thống và cách tân, lụa tơ tằm và gấm thêu tay.",
    cleanBufferDays: 1,
    sortOrder: 1,
    group: "women",
  },
  {
    id: 2,
    slug: "dam-da-hoi",
    name: "Đầm dạ hội",
    description: "Những chiếc đầm dài dành cho gala, tiệc cưới và thảm đỏ.",
    cleanBufferDays: 1,
    sortOrder: 2,
    group: "women",
  },
  {
    id: 3,
    slug: "vay-cuoi",
    name: "Váy cưới",
    description: "Váy cưới ren, satin và tulle tinh tế sang trọng.",
    cleanBufferDays: 2,
    sortOrder: 3,
    group: "women",
  },
  {
    id: 4,
    slug: "dam-du-tiec",
    name: "Đầm dự tiệc",
    description: "Đầm cocktail, đầm midi cho tiệc tối, sinh nhật và hẹn hò.",
    cleanBufferDays: 1,
    sortOrder: 4,
    group: "women",
  },
  {
    id: 5,
    slug: "ao-khoac",
    name: "Áo khoác",
    description: "Trench coat, blazer và áo khoác dạ dáng dài.",
    cleanBufferDays: 1,
    sortOrder: 5,
    group: "women",
  },
  {
    id: 6,
    slug: "vest-nam",
    name: "Vest & Suit nam",
    description: "Suit may đo dáng slim và classic cho quý ông.",
    cleanBufferDays: 1,
    sortOrder: 6,
    group: "men",
  },
  {
    id: 7,
    slug: "tuxedo",
    name: "Tuxedo",
    description: "Tuxedo ve satin cho tiệc tối black-tie trang trọng.",
    cleanBufferDays: 1,
    sortOrder: 7,
    group: "men",
  },
  {
    id: 8,
    slug: "tui-clutch",
    name: "Túi & Clutch",
    description: "Clutch dạ tiệc và túi xách hàng hiệu cao cấp.",
    cleanBufferDays: 0,
    sortOrder: 8,
    group: "accessories",
  },
];

export const BRANDS = [
  {
    id: 1,
    slug: "linh-bui",
    name: "Linh Bùi Haute Couture",
    description: "Thương hiệu áo dài và đầm thiết kế thủ công tinh xảo.",
  },
  {
    id: 2,
    slug: "chung-thanh-phong",
    name: "Chung Thanh Phong Bridal",
    description: "Nhà thiết kế váy cưới và đầm dạ hội hàng đầu Việt Nam.",
  },
  {
    id: 3,
    slug: "adam-store",
    name: "Adam Store",
    description: "Thương hiệu âu phục nam may sẵn và phụ kiện vest lịch lãm.",
  },
  {
    id: 4,
    slug: "elise",
    name: "Elise Fashion",
    description: "Thời trang cao cấp phong cách hiện đại và thanh lịch.",
  },
  {
    id: 5,
    slug: "charles-keith",
    name: "Charles & Keith",
    description: "Thương hiệu phụ kiện túi xách và giày dép quốc tế.",
  },
];

export const CATEGORY_GROUPS = [
  { key: "women", label: "Nữ", href: "/products?group=women", blurb: "Áo dài, đầm dạ hội, váy cưới" },
  { key: "men", label: "Nam", href: "/products?group=men", blurb: "Vest, tuxedo, áo dài nam" },
  { key: "accessories", label: "Phụ kiện", href: "/products?group=accessories", blurb: "Clutch, túi xách cao cấp" },
];

export const OCCASIONS = [
  { slug: "cuoi", name: "Cưới & Đính hôn", blurb: "Cô dâu, chú rể, lễ gia tiên" },
  { slug: "khach-moi-cuoi", name: "Khách mời đám cưới", blurb: "Chỉn chu và lịch sự" },
  { slug: "tet", name: "Tết & Lễ truyền thống", blurb: "Áo dài, gấm truyền thống" },
  { slug: "da-tiec", name: "Dạ tiệc & Gala", blurb: "Đầm dài, tuxedo, black-tie" },
  { slug: "chup-anh", name: "Chụp ảnh & Lookbook", blurb: "Lên hình ấn tượng" },
  { slug: "cong-so", name: "Sự kiện doanh nghiệp", blurb: "Hội thảo, Year-end party" },
];

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug || String(c.id) === String(slug));
}

export function getBrand(slug) {
  return BRANDS.find((b) => b.slug === slug || String(b.id) === String(slug));
}
