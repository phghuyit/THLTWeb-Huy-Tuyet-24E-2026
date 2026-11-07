"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, authErrorMessage } from "@/services/authService";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  async function handleSendCode(e) {
    if (e) e.preventDefault();
    if (!email || loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await authService.sendForgotPasswordCode(email.trim());
      setMessage(res.message || "Mã xác thực 6 số đã được gửi đến email của bạn.");
      setStep("otp");
      setCountdown(60);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    if (!code || loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await authService.verifyForgotPasswordCode({
        email: email.trim(),
        code: code.trim(),
      });
      setNewPassword(res.new_password || "");
      setMessage(res.message || "Mật khẩu đã được cấp lại thành công!");
      setStep("success");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!newPassword) return;
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = newPassword;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8 shadow-md">
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl font-bold text-ink">Quên mật khẩu</h1>
          <p className="mt-1 text-xs text-ink-2">
            {step === "email" && "Nhập email đăng ký để nhận mã xác thực 6 chữ số qua Gmail."}
            {step === "otp" && "Nhập mã 6 chữ số vừa nhận được trong hộp thư của bạn."}
            {step === "success" && "Mật khẩu của bạn đã được khởi tạo lại thành công!"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-danger border border-red-200">
            {error}
          </div>
        )}
        {message && !error && step !== "success" && (
          <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
            {message}
          </div>
        )}

        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-ink-2 mb-1">
                Địa chỉ Email <span className="text-danger">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input w-full"
                autoComplete="email"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="btn btn-block mt-2 disabled:opacity-60"
            >
              {loading ? "Đang gửi mã..." : "Gửi mã xác thực"}
            </button>

            <div className="pt-2 text-center text-xs text-ink-2">
              Nhớ mật khẩu?{" "}
              <Link href="/login" className="font-semibold text-accent hover:underline">
                Quay lại Đăng nhập
              </Link>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="otp" className="text-xs font-semibold text-ink-2">
                  Mã xác thực (6 chữ số) <span className="text-danger">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError("");
                  }}
                  className="text-xs text-accent hover:underline"
                >
                  Đổi email
                </button>
              </div>
              <input
                id="otp"
                type="text"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="input w-full text-center text-2xl font-mono tracking-widest font-bold"
                autoFocus
              />
              <p className="mt-1 text-[11px] text-ink-3">
                Mã xác thực chỉ có hiệu lực trong vòng 10 phút.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="btn btn-block mt-2 disabled:opacity-60"
            >
              {loading ? "Đang xác thực..." : "Xác nhận & Cấp mật khẩu"}
            </button>

            <div className="text-center pt-2">
              {countdown > 0 ? (
                <p className="text-xs text-ink-3">
                  Gửi lại mã sau <span className="font-semibold text-accent">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendCode()}
                  disabled={loading}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Chưa nhận được mã? Gửi lại
                </button>
              )}
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4">
              <p className="text-xs uppercase tracking-wider text-amber-800 font-bold mb-1">
                Mật khẩu mới của bạn (8 ký tự)
              </p>
              <div className="my-2 select-all font-mono text-2xl font-extrabold text-amber-950 tracking-wider">
                {newPassword}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-amber-900 shadow-sm border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Sao chép mật khẩu</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-ink-2 leading-relaxed">
              Vui lòng sao chép mật khẩu trên để đăng nhập. Bạn có thể tiếp tục sử dụng mật khẩu này hoặc thay đổi lại mật khẩu cá nhân trong phần <strong>Hồ sơ tài khoản</strong>.
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="btn btn-block"
            >
              Đến trang Đăng nhập ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
