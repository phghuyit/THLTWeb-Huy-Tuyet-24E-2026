"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { authErrorMessage } from "@/services/authService";
import { AuthField } from "@/components/user/AuthField";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    setErrors({});
    setMessage("");
    setSubmitting(true);
    try {
      await login(payload);
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect") || "/";
      router.replace(redirect);
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
        <h1 className="text-center font-serif text-2xl font-bold text-ink">Đăng nhập StyleRent</h1>
        <p className="mt-1 text-center text-xs text-ink-2">Nhập thông tin tài khoản của bạn để tiếp tục</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {message && <p role="alert" className="text-sm text-danger">{message}</p>}
          <AuthField name="email" label="Email" type="email" placeholder="name@example.com" autoComplete="email" required maxLength={255} error={errors.email?.[0]} />
          <div>
            <AuthField name="password" label="Mật khẩu" type="password" autoComplete="current-password" required minLength={8} maxLength={256} error={errors.password?.[0]} />
            <div className="mt-1 flex justify-end">
              <Link href="/forgot-password" className="text-xs text-accent hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn btn-block mt-2 disabled:opacity-60">
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-ink-2">
          Chưa có tài khoản? <Link href="/register" className="font-semibold text-accent hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
