export const SETTINGS = {
  hold_ttl_minutes: 15,
  checkout_ttl_minutes: 30,
  default_clean_buffer_days: 1,
  prep_buffer_days: 0,
  min_lead_days: 0,
  max_advance_days: 180,
  min_rental_days: 1,
  max_rental_days: 30,
  deposit_rate_default: 0.6,
  prepay_rental_rate: 0.3,
  full_payment_discount: 0.02,
  late_fee_rate: 1.5,
  late_fee_grace_hours: 3,
  late_fee_cap_multiplier: 2,
  staff_fee_limit: 500000,
  refund_auto_limit: 2000000,
};

export const SHIPPING = {
  one_way_fee: 30000,
  round_trip_fee: 60000,
  supported_provinces: ["TP. Hồ Chí Minh", "Bình Dương", "Đồng Nai", "Hà Nội", "Đà Nẵng"],
  free_shipping_threshold: 3000000,
};

export const STORE = {
  brand: "StyleRent",
  tagline: "Wear More. Own Less.",
  address: "123 Nguyễn Văn Cừ, Phường 4, Quận 5, TP. Hồ Chí Minh",
  hours: "09:00 – 21:00 · Thứ 2 – Chủ nhật",
  phone: "1900 6868",
  email: "hello@stylerent.vn",
  return_due_hour: 18,
};

export const CANCELLATION_POLICY = [
  { minDaysBefore: 7, rentalRefundRate: 1, depositRefundRate: 1, label: "Từ 7 ngày trở lên trước ngày nhận" },
  { minDaysBefore: 3, rentalRefundRate: 0.7, depositRefundRate: 1, label: "Trước 3 – 6 ngày" },
  { minDaysBefore: 1, rentalRefundRate: 0.5, depositRefundRate: 1, label: "Trước 1 – 2 ngày" },
  { minDaysBefore: 0, rentalRefundRate: 0, depositRefundRate: 1, label: "Dưới 24 giờ hoặc không đến nhận" },
];

export const CONDITION_FEES = [
  { condition: "Nguyên vẹn", fee: "Miễn phí", unit: "→ Giặt ủi, hoàn cọc đầy đủ" },
  { condition: "Bẩn nặng (dính màu, mùi, vết khó tẩy)", fee: "Phí giặt đặc biệt theo danh mục", unit: "→ Giặt ủi" },
  { condition: "Hư hỏng nhẹ (bung chỉ, rách nhỏ, mất hạt)", fee: "10 – 30% giá trị đồ", unit: "→ Sửa chữa" },
  { condition: "Hư hỏng nặng (không sửa được)", fee: "100% giá trị đồ", unit: "→ Thanh lý" },
  { condition: "Mất", fee: "100% giá trị đồ + 20% phí cơ hội", unit: "→ Ghi nhận mất" },
];
