"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ToastProvider } from "@/components/ui/Toast";
import { adminAuthService } from "@/services/adminAuthService";
import { clearAdminToken, getAdminToken } from "@/services/adminToken";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    let cancelled = false;

    async function checkLogin() {
      setChecking(true);
      setAdmin(null);
      setError("");
      try {
        if (!getAdminToken()) {
          router.replace("/admin/login");
          return;
        }

        const user = await adminAuthService.getCurrentAdmin();
        if (!cancelled) setAdmin(user);
      } catch (error) {
        if (cancelled) return;
        setAdmin(null);
        if ([401, 403].includes(error.response?.status)) {
          clearAdminToken();
          router.replace("/admin/login");
        } else {
          setError("Chưa kết nối được máy chủ để kiểm tra đăng nhập.");
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    checkLogin();
    return () => { cancelled = true; };
  }, [isLoginPage, pathname, router, retry]);


  if (isLoginPage) return children;

  if (checking || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-6 text-center">
        <div>
          <p role={error ? "alert" : "status"} className="text-sm text-ink-2">
            {error || "Đang kiểm tra quyền quản trị..."}
          </p>
          {error && <button type="button" className="btn btn-sm mt-4" onClick={() => setRetry(retry + 1)}>Thử lại</button>}
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas text-ink">
        <AdminSidebar />
        <div className="ml-60 flex min-h-screen flex-col">
          <AdminHeader admin={admin} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
