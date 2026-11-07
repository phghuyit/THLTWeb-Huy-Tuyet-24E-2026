"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMounted, useScrollY } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  IconBag,
  IconBox,
  IconChevronDown,
  IconSearch,
  IconUser,
} from "@/components/ui/Icons";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { authErrorMessage } from "@/services/authService";
import { menuService } from "@/services/menuService";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollY = useScrollY();
  const mounted = useMounted();
  const cart = useCart();
  const { user, loading: authLoading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [authError, setAuthError] = useState("");

  async function handleLogout() {
    setLoggingOut(true);
    setAuthError("");
    try {
      await logout();
    } catch (error) {
      setAuthError(authErrorMessage(error));
    } finally {
      setLoggingOut(false);
    }
  }
  const [keyword, setKeyword] = useState("");

  const overHero = pathname === "/";
  const solid = scrollY > 24 || !overHero;

  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadMenus() {
      try {
        const data = await menuService.getMenus("header");
        if (active && Array.isArray(data) && data.length > 0) {
          setNavLinks(
            data
              .filter((m) => m.status === "active")
              .map((m) => ({
                label: m.name,
                href: m.link === "/posts" ? "/news" : m.link || "/products",
                children: Array.isArray(m.children)
                  ? m.children
                      .filter((c) => c.status === "active")
                      .map((c) => ({
                        label: c.name,
                        href: c.link === "/posts" ? "/news" : c.link,
                      }))
                  : [],
              }))
          );
        }
      } catch {
      }
    }
    loadMenus();
    return () => {
      active = false;
    };
  }, []);

  const displayName = user?.fullname || user?.name || "Tài khoản";
  const initialLetter = displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-500 ease-luxe",
        overHero ? "fixed" : "sticky",
        solid
          ? "border-b border-line bg-canvas/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="shell flex h-[76px] items-center justify-between gap-4">
        <Link
          href="/"
          className={cn(
            "font-display text-[22px] transition-colors duration-500 ease-luxe",
            solid ? "text-ink" : "text-canvas",
          )}
          style={{ letterSpacing: "0.04em" }}
        >
          StyleRent
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const hasChildren = Array.isArray(link.children) && link.children.length > 0;
            const active =
              pathname === link.href ||
              (hasChildren && link.children.some((c) => pathname === c.href));

            if (hasChildren) {
              return (
                <div key={link.label} className="relative group py-2">
                  <Link
                    href={link.href}
                    className={cn(
                      "link-line link-underline-in flex items-center gap-1 text-[11.5px] uppercase tracking-[0.13em] transition-colors",
                      solid
                        ? active
                          ? "text-accent font-semibold"
                          : "text-ink"
                        : active
                          ? "text-canvas font-semibold"
                          : "text-canvas/85",
                    )}
                  >
                    <span>{link.label}</span>
                    <IconChevronDown
                      width={11}
                      height={11}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                  </Link>

                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-0 pt-2 z-50 min-w-[190px]">
                    <div className="rounded-lg border border-line bg-canvas/95 backdrop-blur-md p-1.5 shadow-xl">
                      <Link
                        href={link.href}
                        className="block rounded-md px-3 py-2 text-xs font-semibold text-accent hover:bg-line/40 transition-colors"
                      >
                        Tất cả {link.label.toLowerCase()}
                      </Link>
                      <div className="my-1 border-t border-line/50" />
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-md px-3 py-2 text-xs text-ink hover:text-accent hover:bg-line/40 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "link-line link-underline-in text-[11.5px] uppercase tracking-[0.13em] transition-colors",
                  solid
                    ? active
                      ? "text-accent font-semibold"
                      : "text-ink"
                    : active
                      ? "text-canvas font-semibold"
                      : "text-canvas/85",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (keyword.trim()) {
                router.push(`/products?search=${encodeURIComponent(keyword.trim())}`);
              }
            }}
            className="relative hidden sm:block"
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm..."
              className={cn(
                "h-9 w-36 lg:w-44 rounded-sm border px-3 pl-8 text-[12.5px] outline-none transition-colors",
                solid
                  ? "border-line bg-surface text-ink placeholder:text-ink-3"
                  : "border-canvas/30 bg-canvas/10 text-canvas placeholder:text-canvas/60",
              )}
            />
            <IconSearch
              width={13}
              height={13}
              className={cn(
                "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2",
                solid ? "text-ink-3" : "text-canvas/70",
              )}
            />
          </form>

          <Link
            href="/cart"
            aria-label="Giỏ thuê"
            className={cn(
              "relative p-2 transition-colors",
              solid ? "text-ink hover:text-accent" : "text-canvas",
            )}
          >
            <IconBag width={18} height={18} />
            {mounted && cart.count > 0 && (
              <span className="absolute right-0 top-0 grid h-4 min-w-[16px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {cart.count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button
                type="button"
                className={cn(
                  "flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-xs font-medium transition-all duration-200 border",
                  solid
                    ? "border-line/80 text-ink hover:border-ink/30 hover:bg-line/30"
                    : "border-canvas/30 text-canvas hover:bg-canvas/10",
                )}
                aria-label="Tài khoản cá nhân"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-accent overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    initialLetter
                  )}
                </span>
                <span className="hidden max-w-28 truncate sm:inline-block">
                  {displayName}
                </span>
                <IconChevronDown
                  width={14}
                  height={14}
                  className="transition-transform duration-200 group-hover:rotate-180 opacity-70"
                />
              </button>

              <div
                className="pointer-events-none absolute right-0 top-full pt-2 opacity-0 -translate-y-1 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 z-50 min-w-[210px]"
              >
                <div className="rounded-xl border border-line bg-canvas p-1.5 shadow-xl shadow-ink/5 backdrop-blur-lg">
                  <div className="px-3 py-2 border-b border-line/60">
                    <p className="text-[13px] font-semibold text-ink truncate">
                      {displayName}
                    </p>
                    {user.email && (
                      <p className="text-[11px] text-ink-3 truncate mt-0.5">
                        {user.email}
                      </p>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-ink hover:bg-line/40 hover:text-accent transition-colors"
                    >
                      <IconUser width={15} height={15} className="text-ink-3" />
                      <span>Quản lý tài khoản</span>
                    </Link>

                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-ink hover:bg-line/40 hover:text-accent transition-colors"
                    >
                      <IconBox width={15} height={15} className="text-ink-3" />
                      <span>Đơn thuê</span>
                    </Link>
                  </div>

                  <div className="border-t border-line/60 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-danger hover:bg-danger/10 transition-colors disabled:opacity-60 text-left"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>{loggingOut ? "Đang thoát..." : "Đăng xuất"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(
                "btn btn-sm gap-1.5",
                solid
                  ? "btn-outline"
                  : "border-canvas/60 text-canvas hover:bg-canvas hover:text-ink",
              )}
            >
              <IconUser width={14} height={14} />
              {authLoading ? "Đang kiểm tra..." : "Đăng nhập"}
            </Link>
          )}
        </div>
      </div>
      {authError && <p role="alert" className="shell pb-3 text-sm text-danger">{authError}</p>}
    </header>
  );
}
