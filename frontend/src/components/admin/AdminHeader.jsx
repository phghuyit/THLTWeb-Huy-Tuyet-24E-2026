"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateLong, todayISO } from "@/lib/date";
import { adminAuthService } from "@/services/adminAuthService";
import { authErrorMessage } from "@/services/authService";

export default function AdminHeader({ admin }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const name = admin?.name || "Quản trị viên";

  async function handleLogout() {
    setPending(true);
    setError("");
    try {
      await adminAuthService.logout();
      router.replace("/admin/login");
    } catch (error) {
      setError(authErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 px-6 backdrop-blur-sm">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 py-2">
        <div className="text-[12.5px] text-ink-2">Hôm nay: {formatDateLong(todayISO())}</div>
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] font-medium text-ink">{name}</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">{name.charAt(0)}</div>
          <button type="button" onClick={handleLogout} disabled={pending} className="btn btn-outline btn-sm disabled:opacity-60">
            {pending ? "Đang thoát..." : "Đăng xuất"}
          </button>
        </div>
      </div>
      {error && <p role="alert" className="pb-3 text-sm text-danger">{error}</p>}
    </header>
  );
}
