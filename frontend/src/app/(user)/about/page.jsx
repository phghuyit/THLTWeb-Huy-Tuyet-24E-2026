"use client";

import Link from "next/link";
import { STORE } from "@/lib/settings";
import { Reveal } from "@/components/ui/Primitives";

export default function AboutPage() {
  return (
    <div className="pt-[76px]">
      <header className="shell border-b border-line py-16 md:py-20">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow text-ink-3">Câu chuyện thương hiệu</p>
          <h1 className="display-1 mt-5">Về chúng tôi — StyleRent</h1>
          <p className="lede mt-6 max-w-[62ch]">
            &ldquo;{STORE.tagline}&rdquo;
          </p>
        </Reveal>
      </header>

      <div className="shell py-14 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mb-5 leading-snug">
            Phong Cách Sống Mới Của Người Tiêu Dùng Hiện Đại
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-ink-2 leading-relaxed">
            <p>
              StyleRent ra đời từ một câu hỏi giản đơn nhưng đầy trăn trở: Tại sao chúng ta phải chi hàng triệu đồng cho một chiếc váy dạ hội đắt đỏ chỉ để mặc đúng một lần chụp ảnh rồi để quên trong tủ?
            </p>
            <p>
              Chúng tôi tin rằng sự tự tin và nét thanh lịch không nên bị giới hạn bởi giá cả hay không gian tủ quần áo. Dịch vụ cho thuê trang phục cao cấp của StyleRent giúp bạn liên tục đổi mới phong cách trong mọi dịp quan trọng: tiệc cưới, sự kiện công ty, dạ hội tốt nghiệp hay những chuyến du lịch xa.
            </p>
            <p>
              Hơn cả thời trang, đó là cam kết hướng tới tiêu dùng bền vững, giảm thiểu lượng rác thải dệt may và lan tỏa tình yêu với những thiết kế may đo tinh tế.
            </p>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-line shadow-md aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80"
            alt="StyleRent Studio"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-serif font-bold text-ink">
            Giá Trị Cốt Lõi Tại StyleRent
          </h2>
          <p className="text-xs sm:text-sm text-ink-2 mt-2">
            Những nguyên tắc định hình dịch vụ và chất lượng sản phẩm của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-line bg-surface p-6">
            <h3 className="font-serif font-bold text-base text-ink mb-2">
              Chính Hãng & Cao Cấp
            </h3>
            <p className="text-xs text-ink-2 leading-relaxed">
              Mọi trang phục từ áo dài, váy dạ hội đến tuxedo đều được may từ chất liệu cao cấp và tuyển chọn từ các nhà thiết kế uy tín.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6">
            <h3 className="font-serif font-bold text-base text-ink mb-2">
              Thời Trang Bền Vững
            </h3>
            <p className="text-xs text-ink-2 leading-relaxed">
              Kéo dài vòng đời của mỗi bộ trang phục, hạn chế tình trạng mua sắm lãng phí và bảo vệ tài nguyên môi trường.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6">
            <h3 className="font-serif font-bold text-base text-ink mb-2">
              Vệ Sinh Khử Khuẩn 100%
            </h3>
            <p className="text-xs text-ink-2 leading-relaxed">
              Áp dụng quy trình giặt khô và hấp nhiệt chuẩn quốc tế sau mỗi lượt thuê, cam kết thơm tho và sạch sẽ như mới.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6">
            <h3 className="font-serif font-bold text-base text-ink mb-2">
              Tư Vấn Phong Cách Tận Tâm
            </h3>
            <p className="text-xs text-ink-2 leading-relaxed">
              Đội ngũ stylist luôn sẵn sàng hỗ trợ đo size chuẩn xác và gợi ý phụ kiện phù hợp cho từng vóc dáng.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-8 sm:p-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-ink-3 font-semibold mb-1">
              Địa Chỉ Showroom
            </h4>
            <p className="text-sm font-medium text-ink mt-2">{STORE.address}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-ink-3 font-semibold mb-1">
              Thời Gian Mở Cửa
            </h4>
            <p className="text-sm font-medium text-ink mt-2">{STORE.hours}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-ink-3 font-semibold mb-1">
              Hotline Tư Vấn
            </h4>
            <p className="text-sm font-medium text-accent font-semibold mt-2">{STORE.phone}</p>
            <p className="text-xs text-ink-3 mt-1">{STORE.email}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/products" className="btn px-8 py-3 text-xs uppercase tracking-widest font-semibold">
          Khám Phá Bộ Sưu Tập
        </Link>
        <Link href="/contact" className="btn btn-outline px-8 py-3 text-xs uppercase tracking-widest font-semibold">
          Liên Hệ Chúng Tôi
        </Link>
      </div>
      </div>
    </div>
  );
}
