"use client";

import Link from "next/link";
import { formatVnd } from "@/lib/money";
import { CANCELLATION_POLICY, CONDITION_FEES, SETTINGS, SHIPPING } from "@/lib/settings";
import { Reveal } from "@/components/ui/Primitives";

export default function PricingPolicyPage() {
  return (
    <div className="pt-[76px]">
      <header className="shell border-b border-line py-16 md:py-20">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow text-ink-3">Minh bạch & Rõ ràng</p>
          <h1 className="display-1 mt-5">Bảng giá & Quy định thuê</h1>
          <p className="lede mt-6 max-w-[62ch]">
            Mọi quy định về giá thuê, tiền cọc, chính sách hoàn tiền và bồi hoàn đều được StyleRent công khai minh bạch nhằm mang lại trải nghiệm an tâm nhất cho khách hàng.
          </p>
        </Reveal>
      </header>

      <div className="shell py-14 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="text-2xl font-serif font-bold text-accent">01</span>
            <h3 className="text-lg font-serif font-bold text-ink mt-2 mb-3">
              Giá Thuê Linh Hoạt
            </h3>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              Giá thuê được tính theo số ngày bạn chọn thực tế. Càng thuê dài ngày (từ 4 đến 30 ngày), chi phí thuê trung bình theo ngày càng ưu đãi.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-line text-xs text-ink-3">
            Thời hạn thuê tối thiểu {SETTINGS.min_rental_days} ngày, tối đa {SETTINGS.max_rental_days} ngày.
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="text-2xl font-serif font-bold text-accent">02</span>
            <h3 className="text-lg font-serif font-bold text-ink mt-2 mb-3">
              Tiền Đặt Cọc
            </h3>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              Mỗi sản phẩm có mức cọc tương ứng với giá trị trang phục. StyleRent cam kết hoàn trả 100% tiền cọc ngay khi đồ được kiểm tra nguyên vẹn lúc trả lại.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-line text-xs text-ink-3">
            Tự động hoàn cọc trong 24 giờ sau khi xác nhận trả đồ.
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="text-2xl font-serif font-bold text-accent">03</span>
            <h3 className="text-lg font-serif font-bold text-ink mt-2 mb-3">
              Miễn Phí Giặt Ủi
            </h3>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              Bạn không cần tự giặt hấp trước hoặc sau khi trả. StyleRent có quy trình giặt khô và hấp nhiệt chuẩn chuyên nghiệp cho từng chất liệu lụa, ren và dạ hội.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-line text-xs text-ink-3">
            Giao nhận tận nơi với cước phí đồng giá {formatVnd(SHIPPING.one_way_fee)}.
          </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-ink">
            Chính Sách Hủy Đơn & Hoàn Tiền
          </h2>
          <p className="text-xs sm:text-sm text-ink-2 mt-1">
            Áp dụng khi khách hàng có việc đột xuất cần đổi lịch hoặc hủy đơn thuê trước ngày nhận đồ.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-line bg-line/20 text-ink uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-6 py-4">Thời Điểm Báo Hủy</th>
                <th className="px-6 py-4">Hoàn Trả Tiền Thuê</th>
                <th className="px-6 py-4">Hoàn Trả Tiền Cọc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink-2">
              {CANCELLATION_POLICY.map((item, idx) => (
                <tr key={idx} className="hover:bg-line/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-ink">{item.label}</td>
                  <td className="px-6 py-4 text-accent font-semibold">
                    {Math.round(item.rentalRefundRate * 100)}%
                  </td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">
                    {Math.round(item.depositRefundRate * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-ink">
            Quy Định Tình Trạng Trang Phục & Bồi Hoàn
          </h2>
          <p className="text-xs sm:text-sm text-ink-2 mt-1">
            Quy chuẩn kiểm tra đồ sau khi hoàn tất thời hạn thuê.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-line bg-line/20 text-ink uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-6 py-4">Tình Trạng Khi Nhận Lại</th>
                <th className="px-6 py-4">Mức Phí Xử Lý</th>
                <th className="px-6 py-4">Biện Pháp Xử Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink-2">
              {CONDITION_FEES.map((fee, idx) => (
                <tr key={idx} className="hover:bg-line/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-ink">{fee.condition}</td>
                  <td className="px-6 py-4 text-accent font-semibold">{fee.fee}</td>
                  <td className="px-6 py-4 text-ink-3">{fee.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-gradient-to-br from-warm/40 to-surface p-8 sm:p-12 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-serif font-bold text-ink mb-3">
          Bạn Đã Sẵn Sàng Chọn Trang Phục Cho Sự Kiện Tới?
        </h3>
        <p className="text-xs sm:text-sm text-ink-2 max-w-xl mx-auto mb-6">
          Khám phá bộ sưu tập đầm dạ hội, áo dài truyền thống và suit cao cấp được chọn lọc kỹ lưỡng tại StyleRent.
        </p>
        <Link href="/products" className="btn px-8 py-3 text-xs uppercase tracking-widest font-semibold">
          Xem Toàn Bộ Sản Phẩm
        </Link>
      </div>
      </div>
    </div>
  );
}
