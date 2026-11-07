export const UNIT_STATUS = {
  available: {
    label: "Sẵn sàng",
    tone: "success",
    rentable: true,
    description: "Đang ở kho, có thể gán vào đơn mới.",
  },
  reserved: {
    label: "Đã giữ cho đơn",
    tone: "info",
    rentable: false,
    description: "Đã gán cho một đơn, chưa bàn giao.",
  },
  rented: {
    label: "Đang ở chỗ khách",
    tone: "accent",
    rentable: false,
    description: "Đã bàn giao, đang trong thời gian thuê.",
  },
  cleaning: {
    label: "Đang giặt ủi",
    tone: "warning",
    rentable: false,
    description: "Trong hàng đợi giặt ủi sau khi khách trả.",
  },
  repairing: {
    label: "Đang sửa chữa",
    tone: "warning",
    rentable: false,
    description: "Đang sửa, chỉ về kho khi QC đạt.",
  },
  retired: {
    label: "Đã thanh lý",
    tone: "neutral",
    rentable: false,
    description: "Ngừng khai thác, giữ lại để tham chiếu đơn cũ.",
  },
  lost: {
    label: "Mất",
    tone: "danger",
    rentable: false,
    description: "Khách làm mất, đã ghi nhận bồi thường.",
  },
};
