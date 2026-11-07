import { formatVnd } from "./money";
import { SETTINGS, SHIPPING } from "./settings";

export function calcRentalPrice(variant, days) {
  const n = Math.max(1, Math.floor(days || 1));
  const pricePerDay = Number(variant?.pricePerDay || variant?.rental_price_per_day || 0);
  const extraDayPrice = Number(variant?.extraDayPrice || pricePerDay);
  const tiers = variant?.tiers || [];

  const options = [
    {
      total: pricePerDay * n,
      lines: [{ label: `${n} ngày × ${formatVnd(pricePerDay)}`, days: n, price: pricePerDay * n }],
      tier: null,
    },
  ];

  for (const tier of tiers) {
    if (tier.days >= n) {
      options.push({
        total: tier.price,
        lines: [{ label: tier.label, days: tier.days, price: tier.price }],
        tier,
      });
    } else {
      const extraDays = n - tier.days;
      options.push({
        total: tier.price + extraDays * extraDayPrice,
        lines: [
          { label: tier.label, days: tier.days, price: tier.price },
          {
            label: `${extraDays} ngày thuê thêm × ${formatVnd(extraDayPrice)}`,
            days: extraDays,
            price: extraDays * extraDayPrice,
          },
        ],
        tier,
      });
    }
  }

  const best = options.reduce((a, b) => (b.total < a.total ? b : a));
  const dailyEquivalent = pricePerDay * n;

  return {
    total: Math.round(best.total),
    breakdown: best.lines,
    dailyEquivalent,
    saved: Math.max(0, dailyEquivalent - best.total),
    effectivePerDay: Math.round(best.total / n),
  };
}

export function describeTiers(variant) {
  const tiers = variant?.tiers || [];
  const pricePerDay = Number(variant?.pricePerDay || variant?.rental_price_per_day || 0);
  const rows = [
    {
      days: 1,
      label: "1 ngày",
      price: pricePerDay,
      perDay: pricePerDay,
      saved: 0,
      bestValue: false,
    },
    ...tiers.map((tier) => ({
      days: tier.days,
      label: tier.label,
      price: tier.price,
      perDay: Math.round(tier.price / tier.days),
      saved: pricePerDay * tier.days - tier.price,
      bestValue: false,
    })),
  ];
  let bestIndex = 0;
  rows.forEach((row, i) => {
    if (row.perDay < rows[bestIndex].perDay) bestIndex = i;
  });
  rows[bestIndex].bestValue = true;
  return rows;
}

export function lineDeposit(variant, quantity = 1) {
  const deposit = Number(variant?.depositAmount || variant?.deposit || 0);
  return deposit * quantity;
}

export function buildQuote(inputs = [], options = {}) {
  const {
    pickupMethod = "at_store",
    paymentPlan = "deposit_hold",
  } = options;

  const lines = inputs.map((input) => {
    const rentalPrice = calcRentalPrice(input.variant, input.days);
    return {
      ...input,
      rentalPrice,
      lineRentalTotal: rentalPrice.total * input.quantity,
      lineDepositTotal: lineDeposit(input.variant, input.quantity),
    };
  });

  const subtotalRental = lines.reduce((sum, l) => sum + l.lineRentalTotal, 0);
  const totalDeposit = lines.reduce((sum, l) => sum + l.lineDepositTotal, 0);
  const savedByTiers = lines.reduce((sum, l) => sum + l.rentalPrice.saved * l.quantity, 0);

  const discount = 0;
  const discountLabel = null;

  let shippingFee = pickupMethod === "delivery" ? SHIPPING.round_trip_fee : 0;
  let shippingWaived = false;
  if (shippingFee > 0 && subtotalRental >= SHIPPING.free_shipping_threshold) {
    shippingFee = 0;
    shippingWaived = true;
  }

  const rentalAfterDiscount = subtotalRental;
  const fullPaymentDiscount =
    paymentPlan === "full" ? Math.round(rentalAfterDiscount * SETTINGS.full_payment_discount) : 0;

  const grandTotal = rentalAfterDiscount + shippingFee + totalDeposit - fullPaymentDiscount;

  const dueNowRaw =
    paymentPlan === "full"
      ? grandTotal
      : Math.round(totalDeposit + subtotalRental * SETTINGS.prepay_rental_rate);
  const dueNow = Math.min(dueNowRaw, grandTotal);

  return {
    lines,
    subtotalRental,
    discount,
    discountLabel,
    shippingFee,
    shippingWaived,
    totalDeposit,
    fullPaymentDiscount,
    grandTotal,
    dueNow,
    dueOnPickup: Math.max(0, grandTotal - dueNow),
    savedByTiers,
  };
}

export function fromPricePerDay(variants = []) {
  if (!variants || variants.length === 0) return 0;
  return Math.min(...variants.map((v) => Number(v.pricePerDay || v.rental_price_per_day || 0)));
}

export function minDeposit(variants = []) {
  if (!variants || variants.length === 0) return 0;
  return Math.min(...variants.map((v) => Number(v.depositAmount || v.deposit || 0)));
}
