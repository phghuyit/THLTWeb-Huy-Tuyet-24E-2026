"use client";

import Link from "next/link";
import { useState } from "react";
import { authService, authErrorMessage } from "@/services/authService";
import { AuthField } from "@/components/user/AuthField";

export default function RegisterPage() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    setErrors({});
    setMessage("");
    setSubmitting(true);
    try {
      const result = await authService.register(payload);
      setMessage(result.message);
      setSuccess(true);
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
      setMessage(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-center font-serif text-2xl font-bold text-ink">
          Tạo tài khoản mới
        </h1>
        <p className="mt-1 text-center text-xs text-ink-2">
          Trở thành thành viên StyleRent để nhận ưu đãi thuê đồ
        </p>
        {success ? (
          <div className="mt-6 space-y-4">
            <p role="status" className="text-sm text-success">
              {message}
            </p>
            <Link href="/login" className="btn btn-block">
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {message && (
              <p role="alert" className="text-sm text-danger">
                {message}
              </p>
            )}
            <AuthField
              name="fullname"
              label="Họ và tên"
              type="text"
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              required
              maxLength={255}
              error={errors.fullname?.[0]}
            />
            <AuthField
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              maxLength={255}
              error={errors.email?.[0]}
            />
            <AuthField
              name="phone"
              label="Số điện thoại"
              type="tel"
              autoComplete="tel"
              placeholder="0901234567"
              pattern="[0-9]{10,11}"
              maxLength={11}
              error={errors.phone?.[0]}
            />
            <AuthField
              name="address"
              label="Địa chỉ"
              type="text"
              autoComplete="street-address"
              placeholder="Số nhà, đường, quận/huyện, TP.HCM"
              maxLength={255}
              error={errors.address?.[0]}
            />
            <AuthField
              name="password"
              label="Mật khẩu"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={256}
              error={errors.password?.[0]}
            />
            <AuthField
              name="password_confirmation"
              label="Xác nhận mật khẩu"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={256}
              error={errors.password_confirmation?.[0]}
            />
            <p className="text-xs text-ink-2">
              Mật khẩu có ít nhất 8 ký tự. Số điện thoại và địa chỉ có thể bổ
              sung sau.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-block mt-2 disabled:opacity-60"
            >
              {submitting ? "Đang đăng ký..." : "Đăng ký tài khoản"}
            </button>
          </form>
        )}
        {!success && (
          <p className="mt-6 text-center text-xs text-ink-2">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-semibold text-accent hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
