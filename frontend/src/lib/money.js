export function formatVnd(amount, opts = {}) {
  const { sign = false, symbol = true } = opts;
  const rounded = Math.round(Number(amount) || 0);
  const negative = rounded < 0;
  const digits = Math.abs(rounded).toString();
  let grouped = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) grouped += ".";
    grouped += digits[i];
  }
  const prefix = negative ? "-" : sign && rounded > 0 ? "+" : "";
  return `${prefix}${grouped}${symbol ? "₫" : ""}`;
}

export function formatPerDay(amount) {
  return `${formatVnd(amount)} / ngày`;
}

export function formatCompactVnd(amount) {
  const val = Number(amount) || 0;
  if (val >= 1000000) {
    const m = val / 1000000;
    const text = Number.isInteger(m) ? String(m) : m.toFixed(2).replace(/0$/, "").replace(".", ",");
    return `${text} triệu`;
  }
  if (val >= 1000) return `${Math.round(val / 1000)}k`;
  return formatVnd(val);
}

export function percent(value) {
  return `${Math.round((Number(value) || 0) * 100)}%`;
}
