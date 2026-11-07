export const ORDER_STATUS = {
  draft: {
    label: "Đơn nháp",
    tone: "neutral",
    description: "Đơn chưa được gửi đi.",
  },
  pending_payment: {
    label: "Chờ thanh toán",
    tone: "warning",
    description: "Đơn đang được giữ chỗ, hoàn tất thanh toán để xác nhận.",
  },
  confirmed: {
    label: "Đã xác nhận",
    tone: "success",
    description: "Shop đã nhận đơn và khóa lịch những món bạn thuê.",
  },
  preparing: {
    label: "Đang soạn đồ",
    tone: "accent",
    description: "Nhân viên đang chọn và kiểm tra từng món trước khi bàn giao.",
  },
  ready: {
    label: "Sẵn sàng bàn giao",
    tone: "accent",
    description: "Đồ đã đóng gói xong, chờ bạn đến nhận hoặc chờ shipper lấy hàng.",
  },
  in_use: {
    label: "Đang thuê",
    tone: "accent",
    description: "Đồ đang ở chỗ bạn. Nhớ mốc hẹn trả để tránh phí trễ.",
  },
  overdue: {
    label: "Quá hạn trả",
    tone: "danger",
    description: "Đã qua hạn trả, hệ thống đang tính phí trễ theo ngày.",
  },
  inspecting: {
    label: "Đang kiểm tra khi trả",
    tone: "accent",
    description: "Shop đã nhận lại đồ và đang lập biên bản kiểm tra tình trạng.",
  },
  pending_approval: {
    label: "Chờ quản lý duyệt",
    tone: "warning",
    description: "Khoản phí phát sinh vượt hạn mức nhân viên, đang chờ quản lý xét duyệt.",
  },
  disputed: {
    label: "Đang khiếu nại",
    tone: "danger",
    description: "Bạn đã gửi khiếu nại về biên bản kiểm tra, shop đang xử lý.",
  },
  completed: {
    label: "Hoàn tất",
    tone: "success",
    description: "Đơn đã quyết toán xong và cọc đã được hoàn theo biên bản.",
  },
  cancelled: {
    label: "Đã huỷ",
    tone: "neutral",
    description: "Đơn đã được huỷ, tiền hoàn theo chính sách huỷ.",
  },
  expired: {
    label: "Hết hạn thanh toán",
    tone: "neutral",
    description: "Đơn tự huỷ vì quá 30 phút chưa thanh toán.",
  },
};

export const TONE_CLASS = {
  neutral: "bg-line-2 text-ink-2",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export function canCancel(status) {
  return status === "pending_payment" || status === "confirmed";
}

export const ORDER_TIMELINE = [
  { key: "pending_payment", label: "Chờ thanh toán", caption: "Đang chờ khách thanh toán" },
  { key: "confirmed", label: "Đã xác nhận", caption: "Đơn hàng đã được xác nhận" },
  { key: "preparing", label: "Đang soạn đồ", caption: "Shop đang đóng gói đồ" },
  { key: "ready", label: "Sẵn sàng", caption: "Đã sẵn sàng giao cho khách" },
  { key: "in_use", label: "Đang thuê", caption: "Khách đang sử dụng trang phục" },
  { key: "completed", label: "Hoàn tất", caption: "Đã hoàn trả và quyết toán" },
];

export function isTerminated(status) {
  return status === "cancelled" || status === "expired";
}

export function currentStepIndex(status) {
  const index = ORDER_TIMELINE.findIndex((s) => s.key === status);
  return index >= 0 ? index : 0;
}
