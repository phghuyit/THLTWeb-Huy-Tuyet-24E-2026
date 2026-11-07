"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { userService } from "@/services/userService";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useMounted } from "@/hooks";
import { formatVnd } from "@/lib/money";
import { formatDate } from "@/lib/date";
import { ProductMedia } from "@/components/user/ProductMedia";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Overlay";
import { voucherService } from "@/services/voucherService";

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useMounted();
  const cart = useCart();
  const toast = useToast();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUserProfile() {
      if (!user) return;

      let currentName = user.fullname || user.name || "";
      let currentPhone = user.phone || "";
      let currentAddress = user.address || "";

      if (!currentPhone || !currentAddress) {
        try {
          const profile = await userService.getProfile();
          if (active && profile) {
            if (profile.fullname || profile.name) {
              currentName = profile.fullname || profile.name;
            }
            if (profile.phone) currentPhone = profile.phone;
            if (profile.address) currentAddress = profile.address;

            if (updateUser) {
              updateUser(profile);
            }
          }
        } catch {
        }
      }

      if (active) {
        let filledSomething = false;
        if (currentName) {
          setName((prev) => prev || currentName);
          filledSomething = true;
        }
        if (currentPhone) {
          setPhone((prev) => prev || currentPhone);
          filledSomething = true;
        }
        if (currentAddress) {
          setAddress((prev) => prev || currentAddress);
          filledSomething = true;
        }

        if (filledSomething) {
          setHasAutoFilled(true);
        }
      }
    }

    loadUserProfile();

    return () => {
      active = false;
    };
  }, [user, updateUser]);

  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);

  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherCodeInput, setVoucherCodeInput] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]);

  useEffect(() => {
    voucherService.getPublicVouchers()
      .then((res) => {
        setAvailableVouchers(res?.data || []);
      })
      .catch(() => {});
  }, []);

  const readyItems = cart.items.filter((item) => {
    if (item.is_in_stock !== undefined) return Boolean(item.is_in_stock);
    if (item.stock_available !== undefined) return item.stock_available >= item.quantity && item.stock_available > 0;
    return true;
  });

  const totalRental = readyItems.reduce((acc, item) => acc + (item.rental_total || 0), 0);
  const totalDeposit = readyItems.reduce((acc, item) => acc + (item.deposit_total || 0), 0);

  const discountAmount = appliedVoucher
    ? Math.min(Number(appliedVoucher.discount_amount || 0), totalRental)
    : 0;
  const finalAmount = Math.max(0, totalRental - discountAmount) + totalDeposit;

  useEffect(() => {
    if (appliedVoucher && totalRental < Number(appliedVoucher.min_order_amount || 0)) {
      setAppliedVoucher(null);
      toast.push({
        tone: "warning",
        title: "Mã giảm giá đã bị gỡ",
        body: `Đơn thuê chưa đạt tối thiểu ${formatVnd(appliedVoucher.min_order_amount)}.`,
      });
    }
  }, [totalRental, appliedVoucher, toast]);

  async function handleApplyVoucher(codeToApply) {
    const code = (codeToApply || voucherCodeInput).trim().toUpperCase();
    if (!code) {
      toast.push({ tone: "danger", title: "Vui lòng nhập mã giảm giá." });
      return;
    }

    setVoucherLoading(true);
    try {
      const res = await voucherService.validateVoucher(code, totalRental);
      if (res.valid && res.voucher) {
        setAppliedVoucher(res.voucher);
        setVoucherCodeInput("");
        setVoucherModalOpen(false);
        toast.push({
          tone: "success",
          title: `Đã áp dụng mã ${res.voucher.code}`,
          body: `Giảm trực tiếp ${formatVnd(res.voucher.discount_amount)} cho đơn hàng này.`,
        });
      }
    } catch (err) {
      toast.push({
        tone: "danger",
        title: "Không thể áp dụng mã",
        body: err?.response?.data?.message || "Mã không hợp lệ hoặc chưa đủ điều kiện.",
      });
    } finally {
      setVoucherLoading(false);
    }
  }

  function handleRemoveVoucher() {
    setAppliedVoucher(null);
    toast.push({ tone: "neutral", title: "Đã hủy áp dụng mã giảm giá" });
  }

  if (mounted && readyItems.length === 0) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="text-2xl font-bold mb-4 font-serif">Không có sản phẩm sẵn sàng thanh toán</h1>
        <p className="text-sm text-ink-2 mb-6">Các món trong giỏ của bạn hiện đang nằm trong danh sách chờ do tạm hết hàng.</p>
        <Link href="/cart" className="btn">
          Quay lại giỏ hàng
        </Link>
      </div>
    );
  }

  async function handleOrderSubmit(e) {
    e.preventDefault();

    if (!user) {
      toast.push({
        tone: "warning",
        title: "Vui lòng đăng nhập tài khoản để đặt đơn thuê và lưu lịch sử đơn hàng.",
      });
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập đầy đủ họ tên, SĐT và địa chỉ nhận đồ" });
      return;
    }

    setLoading(true);
    const orderCode = "SR" + Date.now().toString().slice(-6);

    const orderSnapshot = {
      orderCode,
      name,
      phone,
      address,
      note,
      paymentMethod,
      totalAmount: finalAmount,
      totalRental,
      totalDeposit,
      discountAmount,
      voucherCode: appliedVoucher?.code || null,
      items: readyItems.map((item) => ({
        name: item.name,
        image: item.thumbnail,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        rentalTotal: item.rental_total,
        pickupDate: item.pickup_date,
        returnDate: item.return_date,
      })),
    };

    try {
      await api.post("/orders", {
        order_code: orderCode,
        receiver_name: name,
        receiver_phone: phone,
        address: address,
        payment_method: paymentMethod,
        total_amount: finalAmount,
        voucher_code: appliedVoucher ? appliedVoucher.code : null,
        items: readyItems.map((item) => ({
          product_size_id: item.product_size_id || null,
          product_id: item.product_id,
          product_slug: item.slug,
          size: item.size || "FreeSize",
          color: item.color || "Tiêu chuẩn",
          quantity: item.quantity,
          days: item.days,
          price_per_day: item.rental_price_per_day,
          deposit_per_item: item.deposit_per_item,
          rental_total: item.rental_total,
          deposit_total: item.deposit_total,
          pickupDate: item.pickup_date,
          returnDate: item.return_date,
          rentalTotal: item.rental_total,
          depositTotal: item.deposit_total,
        })),
      });

      try {
        window.sessionStorage.setItem("last_order", JSON.stringify(orderSnapshot));
      } catch {
      }

      if (paymentMethod === "vnpay") {
        const res = await api.post("/payment/vnpay/create", {
          order_code: orderCode,
          amount: finalAmount,
        });

        if (res.data && res.data.payment_url) {
          window.location.href = res.data.payment_url;
          return;
        }
      }

      cart.clear();
      router.push(`/checkout/result?code=${orderCode}&status=success`);
    } catch (error) {
      console.error("Order error:", error);
      if (error.response?.status === 401) {
        toast.push({
          tone: "danger",
          title: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để hoàn tất đặt đơn.",
        });
        router.push("/login?redirect=/checkout");
      } else {
        toast.push({
          tone: "danger",
          title: error.response?.data?.message || "Không thể tạo đơn hàng trên máy chủ. Vui lòng thử lại sau.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell py-12 md:py-16">
      <div className="mb-8 border-b border-line pb-4">
        <h1 className="text-3xl font-serif text-ink font-bold">Thanh toán đơn thuê</h1>
        <p className="mt-1 text-sm text-ink-2">Điền thông tin giao nhận và chọn phương thức thanh toán.</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleOrderSubmit} className="space-y-8">
          <section className="bg-surface border border-line p-6 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-ink">1. Thông tin người nhận đồ</h2>
            </div>

            {user ? (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs text-emerald-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">✓</span>
                  {hasAutoFilled
                    ? `Đã tự động điền thông tin từ tài khoản (${user.fullname || user.name})`
                    : `Đã kết nối tài khoản (${user.fullname || user.name})`}
                </span>
                <Link href="/account" className="text-[11px] font-medium text-emerald-700 underline hover:text-emerald-900">
                  Cập nhật hồ sơ
                </Link>
              </div>
            ) : (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-900">
                <span className="flex items-center gap-1.5 font-medium">
                  ⚠️ Bạn cần đăng nhập tài khoản để đặt thuê và lưu đơn vào lịch sử đơn thuê.
                </span>
                <Link href="/login?redirect=/checkout" className="font-semibold text-accent underline">
                  Đăng nhập ngay
                </Link>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                />
              </div>

              <div>
                <label className="field-label">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="field-label">Địa chỉ nhận đồ *</label>
              <input
                type="text"
                required
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="field"
              />
            </div>

            <div className="mt-4">
              <label className="field-label">Ghi chú cho shop</label>
              <textarea
                rows={2}
                placeholder="Ví dụ: giao trước 10h sáng, hoặc cần chỉnh chiều dài váy..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="field"
              />
            </div>
          </section>

          <section className="bg-surface border border-line p-6 rounded-sm">
            <h2 className="text-base font-semibold text-ink mb-4">2. Chọn phương thức thanh toán</h2>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "vnpay" ? "border-ink bg-warm/30" : "border-line hover:border-ink-3"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "vnpay"}
                  onChange={() => setPaymentMethod("vnpay")}
                  className="mt-1 accent-[#181818]"
                />
                <div>
                  <span className="font-medium text-sm text-ink block">Cổng thanh toán VNPay (Khuyên dùng)</span>
                  <span className="text-xs text-ink-2 mt-0.5 block">
                    Thanh toán online qua thẻ ATM nội địa, quét mã QR VNPay hoặc thẻ Visa/Mastercard.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "cod" ? "border-ink bg-warm/30" : "border-line hover:border-ink-3"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 accent-[#181818]"
                />
                <div>
                  <span className="font-medium text-sm text-ink block">Thanh toán khi nhận đồ (COD / Tiền mặt)</span>
                  <span className="text-xs text-ink-2 mt-0.5 block">
                    Thanh toán tiền thuê và cọc trực tiếp cho nhân viên giao hàng hoặc tại quầy.
                  </span>
                </div>
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-block py-4 text-sm font-semibold"
          >
            {loading ? "Đang xử lý..." : `Xác nhận & Thanh toán (${formatVnd(finalAmount)})`}
          </button>
        </form>

        <aside className="border border-line bg-surface p-6 rounded-sm self-start">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-ink border-b border-line pb-3">
            Tóm tắt đơn ({readyItems.length} món)
          </h2>

          <ul className="divide-y divide-line my-4 max-h-72 overflow-y-auto pr-1">
            {readyItems.map((item) => (
              <li key={item.id} className="py-3 flex gap-3 text-xs">
                <ProductMedia image={item.thumbnail} ratio="3/4" className="w-12 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{item.name}</p>
                  <p className="text-ink-2 mt-0.5">Size {item.size} · Màu {item.color || "Tiêu chuẩn"}</p>
                  <p className="text-ink-2 mt-0.5">
                    {formatDate(item.pickup_date)} → {formatDate(item.return_date)}
                  </p>
                  <p className="font-semibold text-ink mt-1">{formatVnd(item.rental_total)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-line pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider">
                Mã giảm giá
              </span>
              {availableVouchers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setVoucherModalOpen(true)}
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Chọn mã ưu đãi
                </button>
              )}
            </div>

            {appliedVoucher ? (
              <div className="flex items-center justify-between rounded border border-emerald-300 bg-emerald-50/70 p-2.5 text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-emerald-800 uppercase">
                      {appliedVoucher.code}
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      (-{formatVnd(appliedVoucher.discount_amount)})
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-0.5 line-clamp-1">
                    {appliedVoucher.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveVoucher}
                  className="text-xs text-danger hover:underline ml-2 font-medium"
                >
                  Gỡ
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã ưu đãi..."
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                  className="field flex-1 text-xs py-1.5 font-mono uppercase"
                />
                <button
                  type="button"
                  disabled={voucherLoading || !voucherCodeInput.trim()}
                  onClick={() => handleApplyVoucher()}
                  className="btn btn-outline btn-sm px-3 disabled:opacity-50"
                >
                  {voucherLoading ? "..." : "Áp dụng"}
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-line pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-ink-2">
              <span>Tổng tiền thuê:</span>
              <span>{formatVnd(totalRental)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between font-medium text-emerald-600">
                <span>Giảm giá voucher ({appliedVoucher?.code}):</span>
                <span>-{formatVnd(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-ink-2">
              <span>Tiền cọc (hoàn lại 100%):</span>
              <span>{formatVnd(totalDeposit)}</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-ink border-t border-line pt-3 mt-3">
              <span>Cần thanh toán:</span>
              <span className="text-accent">{formatVnd(finalAmount)}</span>
            </div>
          </div>
        </aside>
      </div>

      <Modal
        open={voucherModalOpen}
        onClose={() => setVoucherModalOpen(false)}
        title="Chọn mã giảm giá"
        description="Danh sách các mã voucher ưu đãi hiện đang áp dụng tại StyleRent."
      >
        <div className="space-y-3 pt-2 max-h-96 overflow-y-auto pr-1">
          {availableVouchers.length === 0 ? (
            <p className="text-xs text-ink-3 text-center py-6">
              Hiện chưa có mã giảm giá nào đang diễn ra.
            </p>
          ) : (
            availableVouchers.map((v) => {
              const minAmount = Number(v.min_order_amount || 0);
              const isEligible = totalRental >= minAmount;
              const diff = minAmount - totalRental;
              const isSelected = appliedVoucher?.code === v.code;

              return (
                <div
                  key={v.id}
                  className={`border rounded-lg p-3.5 flex items-center justify-between gap-3 transition-colors ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/50"
                      : isEligible
                      ? "border-line bg-surface hover:border-ink"
                      : "border-line/70 bg-gray-50/70 opacity-75"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 rounded bg-warm text-ink border border-line">
                        {v.code}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600">
                        Giảm {formatVnd(v.discount_amount)}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-ink mt-1 truncate">
                      {v.name}
                    </p>

                    <p className="text-[11px] text-ink-3 mt-0.5">
                      {minAmount > 0 ? (
                        <>Đơn thuê tối thiểu: <strong>{formatVnd(minAmount)}</strong></>
                      ) : (
                        "Áp dụng cho mọi giá trị đơn"
                      )}
                    </p>

                    {!isEligible && (
                      <p className="text-[11px] text-danger mt-0.5 font-medium">
                        Cần thuê thêm {formatVnd(diff)} để áp dụng
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="btn btn-outline btn-sm text-danger border-danger/40 hover:bg-danger/10"
                      >
                        Bỏ chọn
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!isEligible || voucherLoading}
                        onClick={() => handleApplyVoucher(v.code)}
                        className="btn btn-sm text-xs disabled:opacity-40"
                      >
                        Áp dụng
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Modal>
    </div>
  );
}
