"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconArrowRight, IconMail, IconPhone, IconPin } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";
import { menuService } from "@/services/menuService";

export default function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState("");

  const [footerLinks, setFooterLinks] = useState([
    {
      title: "Khám phá",
      links: [
        { label: "Toàn bộ bộ sưu tập", href: "/products" },
        { label: "Váy cưới thiết kế", href: "/products?category=vay-cuoi" },
        { label: "Vest & Tuxedo cao cấp", href: "/products?category=vest-nam" },
        { label: "Tin tức & Cẩm nang", href: "/news" },
      ],
    },
    {
      title: "Hỗ trợ",
      links: [
        { label: "Quy trình thuê trang phục", href: "/products" },
        { label: "Chính sách thuê & hoàn cọc", href: "/products" },
        { label: "Câu hỏi thường gặp", href: "/products" },
        { label: "Tin tức thời trang", href: "/news" },
      ],
    },
    {
      title: "Tài khoản",
      links: [
        { label: "Quản lý tài khoản", href: "/account" },
        { label: "Đơn thuê của tôi", href: "/orders" },
        { label: "Giỏ hàng thuê", href: "/cart" },
      ],
    },
  ]);

  useEffect(() => {
    let active = true;
    async function loadFooterMenus() {
      try {
        const data = await menuService.getMenus("footer");
        if (active && Array.isArray(data) && data.length > 0) {
          setFooterLinks((prev) => [
            {
              title: "Khám phá",
              links: data.map((m) => ({ label: m.name, href: m.link })),
            },
            ...prev.slice(1),
          ]);
        }
      } catch {
      }
    }
    loadFooterMenus();
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="mt-24 border-t border-line bg-canvas">
      <div className="shell">
        <div className="grid gap-10 border-b border-line py-16 md:grid-cols-2 md:gap-20">
          <div data-reveal>
            <p className="eyebrow text-ink-3">Thư của StyleRent</p>
            <h2 className="display-2 mt-4 max-w-[14ch]">Tủ đồ mới, gửi mỗi tháng một lần.</h2>
          </div>
          <div className="flex flex-col justify-end" data-reveal style={{ "--reveal-delay": "120ms" }}>
            <p className="lede max-w-[46ch] text-[14px]">
              Thiết kế mới về, mẹo chọn size và lịch mở đặt cho mùa cưới. Không quảng cáo dày đặc.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) return;
                toast.push({ tone: "success", title: "Đã đăng ký nhận thư", body: email });
                setEmail("");
              }}
              className="mt-6 flex items-center gap-3 border-b border-ink pb-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của bạn"
                className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-ink-3"
                aria-label="Email nhận bản tin"
              />
              <button type="submit" aria-label="Đăng ký" className="p-1 transition-transform duration-300 hover:translate-x-1">
                <IconArrowRight width={18} height={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-10 py-16 md:grid-cols-4">
          <div>
            <p className="font-display text-[22px]" style={{ letterSpacing: "0.04em" }}>
              StyleRent
            </p>
            <p className="mt-3 text-[13px] text-ink-2">Dịch vụ cho thuê trang phục cao cấp & uy tín hàng đầu.</p>
            <ul className="mt-6 space-y-2.5 text-[13px] text-ink-2">
              <li className="flex items-start gap-2.5">
                <IconPin width={15} height={15} className="mt-0.5 shrink-0" />
                123 Đường Thời Trang, Quận 1, TP. Hồ Chí Minh
              </li>
              <li className="flex items-center gap-2.5">
                <IconPhone width={15} height={15} className="shrink-0" />
                0908 123 456
              </li>
              <li className="flex items-center gap-2.5">
                <IconMail width={15} height={15} className="shrink-0" />
                contact@stylerent.vn
              </li>
            </ul>
            <p className="mt-4 text-[12.5px] text-ink-3">Mở cửa: 08:30 - 21:00 hàng ngày</p>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <p className="eyebrow text-ink-3">{column.title}</p>
              <ul className="mt-5 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="link-line link-underline-in text-[13.5px]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-7 text-[12px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} StyleRent · Đồ án hệ thống cho thuê trang phục</p>
          <p>Giá đã bao gồm giặt hấp · Cọc hoàn 100% khi trả đồ nguyên vẹn</p>
        </div>
      </div>
    </footer>
  );
}
