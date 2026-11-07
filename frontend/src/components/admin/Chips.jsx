import { StatusChip } from "@/components/ui/Primitives";
import { ORDER_STATUS } from "@/lib/order-status";

export function OrderStatusChip({ status }) {
  const meta = ORDER_STATUS[status] || {
    label: status,
    tone: "neutral",
  };

  return <StatusChip tone={meta.tone}>{meta.label}</StatusChip>;
}
