import localFont from "next/font/local";
import "./globals.css";

const playfair = localFont({
  variable: "--font-playfair",

  display: "swap",
  src: "./fonts/PlayfairDisplay.ttf",
  weight: "400 900",
});

const inter = localFont({
  src: "./fonts/Inter.ttf",
  weight: "100 900",
  variable: "--font-inter",

  display: "swap",
});

export const metadata = {
  title: "StyleRent — Cho thuê trang phục cao cấp",
  description: "Dịch vụ thuê trang phục dạ hội, áo dài, vest và váy cưới thiết kế.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
