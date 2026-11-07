"use client";

import { useState } from "react";
import { contactService } from "@/services/contactService";
import { STORE } from "@/lib/settings";
import { useToast } from "@/components/ui/Toast";
import { IconMail, IconPhone, IconPin } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Primitives";

export default function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Tư vấn thuê trang phục",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng điền đầy đủ các thông tin bắt buộc!" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await contactService.createContact(form);
      toast.push({
        tone: "success",
        title: "Gửi thông tin liên hệ thành công!",
        description: res.message || "StyleRent sẽ liên hệ với bạn trong vòng 30 phút làm việc.",
      });
      setForm({
        name: "",
        phone: "",
        email: "",
        subject: "Tư vấn thuê trang phục",
        message: "",
      });
    } catch (err) {
      const msg =
        err.response?.data?.errors?.phone?.[0] ||
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        "Không thể gửi yêu cầu liên hệ. Vui lòng kiểm tra lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-[76px]">
      <header className="shell border-b border-line py-16 md:py-20">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow text-ink-3">Hỗ trợ khách hàng</p>
          <h1 className="display-1 mt-5">Liên hệ chúng tôi</h1>
          <p className="lede mt-6 max-w-[62ch]">
            Bạn cần tư vấn chọn trang phục, đặt lịch thử đồ tại showroom hay có câu hỏi về dịch vụ? Đội ngũ StyleRent luôn sẵn lòng phục vụ bạn.
          </p>
        </Reveal>
      </header>

      <div className="shell py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
            <h3 className="font-serif font-bold text-xl text-ink mb-6">
              Thông Tin Showroom
            </h3>

            <div className="space-y-6 text-xs sm:text-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <IconPin width={16} height={16} />
                </div>
                <div>
                  <p className="font-semibold text-ink">Địa chỉ</p>
                  <p className="text-ink-2 mt-1 leading-relaxed">{STORE.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <IconPhone width={16} height={16} />
                </div>
                <div>
                  <p className="font-semibold text-ink">Hotline hỗ trợ & Đặt lịch</p>
                  <p className="text-accent font-semibold mt-1">{STORE.phone}</p>
                  <p className="text-xs text-ink-3 mt-0.5">{STORE.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <IconMail width={16} height={16} />
                </div>
                <div>
                  <p className="font-semibold text-ink">Hộp thư điện tử</p>
                  <p className="text-ink-2 mt-1">{STORE.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
            <h4 className="font-serif font-bold text-base text-ink mb-2">
              Lưu Ý Khi Thử Đồ Tại Showroom
            </h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              Để được tiếp đón chu đáo và có sẵn trang phục vừa kích thước, quý khách vui lòng liên hệ trước ít nhất 2 giờ hoặc điền biểu mẫu liên hệ bên cạnh.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-xl border border-line bg-surface p-6 sm:p-10 shadow-sm">
            <h3 className="font-serif font-bold text-xl text-ink mb-2">
              Gửi Tin Nhắn Cho StyleRent
            </h3>
            <p className="text-xs sm:text-sm text-ink-2 mb-6">
              Điền thông tin bên dưới và chuyên viên tư vấn sẽ liên hệ lại với bạn trong thời gian sớm nhất.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    Họ và tên <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-md border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    Số điện thoại <span className="text-accent">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full rounded-md border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    Địa chỉ email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full rounded-md border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    Chủ đề cần tư vấn
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-md border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink outline-none focus:border-accent"
                  >
                    <option value="Tư vấn thuê trang phục">Tư vấn thuê trang phục</option>
                    <option value="Đặt lịch thử đồ tại showroom">Đặt lịch thử đồ tại showroom</option>
                    <option value="Hỏi về chính sách và bảng giá">Hỏi về chính sách và bảng giá</option>
                    <option value="Hợp tác kinh doanh">Hợp tác kinh doanh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  Nội dung chi tiết <span className="text-accent">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Vui lòng cung cấp thêm thông tin về sự kiện, ngày dự định nhận đồ hoặc mẫu đồ bạn yêu thích..."
                  className="w-full rounded-md border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn w-full py-3 text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
              >
                {submitting ? "Đang gửi..." : "Gửi Yêu Cầu Tư Vấn"}
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
