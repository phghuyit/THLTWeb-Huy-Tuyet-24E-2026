export const WEEKDAY_SHORT = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
export const WEEKDAY_LONG = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

function pad(n) {
  return n < 10 ? `0${n}` : String(n);
}

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseISODate(iso) {
  const [y, m, d] = (iso || "").split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDays(iso, days) {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function diffDays(a, b) {
  const ms = parseISODate(b).getTime() - parseISODate(a).getTime();
  return Math.round(ms / 86400000);
}

export function rentalDays(pickup, returnDate) {
  return Math.max(1, diffDays(pickup, returnDate));
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = parseISODate(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatDateShort(iso) {
  if (!iso) return "";
  const d = parseISODate(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}

export function formatDateLong(iso) {
  if (!iso) return "";
  const d = parseISODate(iso);
  return `${WEEKDAY_LONG[d.getDay()]}, ${formatDate(iso)}`;
}

export function formatDateTime(isoDateTime) {
  if (!isoDateTime) return "";
  const d = new Date(isoDateTime);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function describeDaysLeft(target, from = todayISO()) {
  const d = diffDays(from, target);
  if (d === 0) return "hôm nay";
  if (d === 1) return "ngày mai";
  if (d > 1) return `còn ${d} ngày`;
  if (d === -1) return "quá hạn 1 ngày";
  return `quá hạn ${Math.abs(d)} ngày`;
}

export function formatCountdown(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}
