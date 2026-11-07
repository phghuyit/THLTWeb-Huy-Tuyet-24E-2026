"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconBox, IconChevronDown, IconList, IconMail, IconMenu, IconStore, IconTag, IconTrash, IconTruck, IconUser } from "@/components/ui/Icons";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [postsOpen, setPostsOpen] = useState(true);

  const links = [
    { label: "Dashboard", href: "/admin", icon: <IconStore width={16} height={16} /> },
    { label: "Sản phẩm", href: "/admin/products", icon: <IconTag width={16} height={16} /> },
    {
      label: "Quản lý tồn kho",
      href: "/admin/inventory",
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
    },
    { label: "Đơn hàng", href: "/admin/orders", icon: <IconTruck width={16} height={16} /> },
    { label: "Danh mục", href: "/admin/categories", icon: <IconList width={16} height={16} /> },
    { label: "Thương hiệu", href: "/admin/brands", icon: <IconBox width={16} height={16} /> },
    { label: "Người dùng", href: "/admin/users", icon: <IconUser width={16} height={16} /> },
    {
      label: "Quản lý bài viết",
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
      ),
      children: [
        { label: "Tất cả bài viết", href: "/admin/posts" },
        { label: "Danh mục bài viết", href: "/admin/posts/categories" },
      ],
    },
    {
      label: "Đánh giá",
      href: "/admin/reviews",
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    { label: "Menu điều hướng", href: "/admin/menus", icon: <IconMenu width={16} height={16} /> },
    {
      label: "Banner & Quảng cáo",
      href: "/admin/banners",
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      ),
    },
    {
      label: "Khuyến mãi / Voucher",
      href: "/admin/vouchers",
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
      ),
    },
    { label: "Liên hệ & Hỗ trợ", href: "/admin/contacts", icon: <IconMail width={16} height={16} /> },
    { label: "Thùng rác", href: "/admin/trash", icon: <IconTrash width={16} height={16} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 border-r border-line bg-surface p-4 flex flex-col justify-between z-30">
      <div className="overflow-y-auto no-scrollbar">
        <div className="mb-6 flex items-center justify-between px-2">
          <Link href="/admin" className="text-lg font-bold tracking-tight text-ink">
            StyleRent Admin
          </Link>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            if (link.children) {
              const isChildActive = link.children.some((c) => pathname === c.href);
              return (
                <div key={link.label} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setPostsOpen((prev) => !prev)}
                    className={cn(
                      "w-full flex items-center justify-between gap-2.5 rounded px-3 py-2 text-[13px] font-medium transition-colors text-left",
                      isChildActive ? "text-ink font-semibold" : "text-ink-2 hover:bg-line-2 hover:text-ink"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {link.icon}
                      <span>{link.label}</span>
                    </div>
                    <IconChevronDown
                      width={13}
                      height={13}
                      className={cn("transition-transform duration-200", postsOpen ? "rotate-180" : "")}
                    />
                  </button>

                  {postsOpen && (
                    <div className="pl-6 space-y-1">
                      {link.children.map((child) => {
                        const active = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-2 rounded px-3 py-1.5 text-xs transition-colors",
                              active
                                ? "bg-ink text-white font-medium"
                                : "text-ink-2 hover:bg-line-2 hover:text-ink"
                            )}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded px-3 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-ink text-white"
                    : "text-ink-2 hover:bg-line-2 hover:text-ink"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-line pt-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded px-3 py-2 text-[12.5px] text-ink-2 hover:bg-line-2 hover:text-ink"
        >
          <span>← Về trang khách hàng</span>
        </Link>
      </div>
    </aside>
  );
}
