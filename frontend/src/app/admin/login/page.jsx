"use client";

import Link from "next/link";
import "./admin-login.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconAlert, IconArrowRight, IconCheck, IconEye, IconEyeOff, IconLock, IconMail } from "@/components/ui/Icons";
import { adminAuthService } from "@/services/adminAuthService";
import { clearAdminToken, getAdminToken } from "@/services/adminToken";
import { authErrorMessage } from "@/services/authService";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) return;
    let cancelled = false;
    adminAuthService.getCurrentAdmin().then(() => {
      if (!cancelled) router.replace("/admin");
    }).catch((error) => {
      if ([401, 403].includes(error.response?.status)) clearAdminToken();
    });
    return () => { cancelled = true; };
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    setError("");
    setErrors({});
    setPending(true);
    try {
      await adminAuthService.login(payload, remember);
      router.replace("/admin");
    } catch (error) {
      setError(authErrorMessage(error));
      setErrors(error.response?.data?.errors || {});
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-login grid min-h-screen bg-canvas text-ink lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-accent/25 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-[380px] w-[380px] rounded-full bg-white/8 blur-[120px]" />
        <div className="relative flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-[13px] font-semibold text-ink">S</span>
          <span><span className="block text-[14px] font-semibold leading-tight">StyleRent</span><span className="block text-[11px] leading-tight text-white/55">Operations</span></span>
        </div>
        <div className="relative max-w-[30rem]">
          <p className="font-display text-[40px] leading-[1.12] tracking-[-0.02em]">Mỗi bộ trang phục là một cá thể có lịch riêng.</p>
          <p className="mt-5 text-[13.5px] leading-relaxed text-white/62">Hệ thống quản trị dịch vụ cho thuê trang phục: quản lý sản phẩm, danh mục, thương hiệu và theo dõi đơn thuê.</p>
          <ul className="mt-9 space-y-3">
            {["Quản lý sản phẩm, giá thuê và chương trình sale", "Theo dõi danh mục, thương hiệu và đơn hàng", "Khu vực dành riêng cho tài khoản quản trị viên"].map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-[13px] text-white/78">
                <span className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-white/12"><IconCheck width={11} height={11} /></span>{line}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[11.5px] text-white/40">© {new Date().getFullYear()} StyleRent · Khu vực quản trị</p>
      </aside>

      <main className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-[13px] font-semibold text-white">S</span>
            <span><span className="block text-[14px] font-semibold leading-tight">StyleRent</span><span className="block text-[11px] leading-tight text-ink-3">Operations</span></span>
          </div>
          <h1 className="text-[22px] font-[560] tracking-[-0.015em]">Đăng nhập hệ thống vận hành</h1>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">Dùng tài khoản có quyền quản trị để truy cập hệ thống.</p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="field-label" htmlFor="admin-email">Email quản trị</label>
              <div className="relative">
                <IconMail width={15} height={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3" />
                <input id="admin-email" name="email" type="email" required maxLength={255} autoComplete="username" placeholder="ten.ban@stylerent.vn" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "admin-email-error" : undefined} className="field pl-8" />
              </div>
              {errors.email && <p id="admin-email-error" className="mt-1 text-xs text-danger">{errors.email[0]}</p>}
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <label className="field-label" htmlFor="admin-password">Mật khẩu</label>
                <button type="button" onClick={() => setError("Liên hệ người quản lý hệ thống để đặt lại mật khẩu.")} className="mb-[0.3rem] text-[11.5px] text-ink-3 underline underline-offset-2 hover:text-ink">Quên mật khẩu?</button>
              </div>
              <div className="relative">
                <IconLock width={15} height={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3" />
                <input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required minLength={8} maxLength={256} placeholder="••••••••" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "admin-password-error" : undefined} className="field px-8" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-ink-3 hover:text-ink">
                  {showPassword ? <IconEyeOff width={15} height={15} /> : <IconEye width={15} height={15} />}
                </button>
              </div>
              {errors.password && <p id="admin-password-error" className="mt-1 text-xs text-danger">{errors.password[0]}</p>}
            </div>
            {error && <div role="alert" className="flex items-start gap-2 rounded border border-danger/20 bg-danger-soft px-3 py-2.5 text-[12.5px] text-danger"><IconAlert width={15} height={15} className="mt-0.5 shrink-0" /><span>{error}</span></div>}
            <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-2">
              <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-3.5 w-3.5 accent-[var(--color-ink)]" />Ghi nhớ đăng nhập
            </label>
            <button type="submit" disabled={pending} className="btn btn-lg btn-block gap-1.5 disabled:opacity-60">{pending ? "Đang đăng nhập..." : "Đăng nhập"}{!pending && <IconArrowRight width={15} height={15} />}</button>
          </form>
          <div className="mt-8 border-t border-line pt-5 text-[11.5px] leading-relaxed text-ink-3">
            <p>Chỉ tài khoản quản trị đang hoạt động mới được phép đăng nhập.</p>
            <div className="mt-3 flex justify-between gap-4"><Link href="/" className="underline underline-offset-2 hover:text-ink">← Về trang chủ</Link><Link href="/login" className="underline underline-offset-2 hover:text-ink">Đăng nhập khách hàng</Link></div>
          </div>
        </div>
      </main>
    </div>
  );
}
