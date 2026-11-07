import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { Providers } from "@/components/layout/Providers";

export default function UserLayout({ children }) {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col bg-canvas text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </Providers>
  );
}
