import { Hero } from "@/components/user/Hero";
import { HomeDateBar } from "@/components/user/HomeDateBar";
import { HomeBanner } from "@/components/user/HomeBanner";
import {
  EditorialBlock,
  HowItWorks,
  Lookbook,
  Marquee,
  OccasionGrid,
  ReviewWall,
  SectionHead,
  WhyRent,
} from "@/components/user/HomeSections";
import { ProductRail } from "@/components/user/ProductGrid";
import { homeService } from "@/services/homeService";
import { postService } from "@/services/postService";

export const dynamic = "force-dynamic";

function ApiMessage({ failed, emptyText }) {
  return (
    <p role={failed ? "alert" : "status"} className="border border-line bg-surface px-6 py-10 text-center text-sm text-ink-2">
      {failed ? "Chưa tải được dữ liệu. Bạn vui lòng thử lại sau." : emptyText}
    </p>
  );
}

function HomeProducts({ result, emptyText }) {
  if (result.status === "rejected" || result.value.length === 0) {
    return <ApiMessage failed={result.status === "rejected"} emptyText={emptyText} />;
  }
  return <ProductRail products={result.value} />;
}

export default async function HomePage() {
  const [banners, newArrivals, featured, sale, hotPosts] = await Promise.allSettled([
    homeService.getBanners(),
    homeService.getNewArrivals(),
    homeService.getFeaturedProducts(),
    homeService.getSaleProducts(),
    postService.getHotPosts(),
  ]);

  const featuredPost =
    hotPosts.status === "fulfilled" && Array.isArray(hotPosts.value) && hotPosts.value.length > 0
      ? hotPosts.value[0]
      : null;

  return (
    <>
      <Hero />
      <HomeDateBar />
      <Marquee />

      <HomeBanner banners={banners.status === "fulfilled" ? banners.value : []} />

      <section className="shell py-20 md:py-28">
        <SectionHead
          eyebrow="Vừa nhập tủ"
          title="Mới về"
          link={{ label: "Xem tất cả", href: "/products" }}
        />
        <HomeProducts result={newArrivals} emptyText="Chưa có sản phẩm mới." />
      </section>

      <section className="bg-warm py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="Gợi ý từ StyleRent"
            title="Sản phẩm hot"
            link={{ label: "Xem tất cả sản phẩm hot", href: "/products?is_featured=1" }}
          />
          <HomeProducts result={featured} emptyText="Chưa có sản phẩm nổi bật." />
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead
          eyebrow="Ưu đãi đang có"
          title="Sản phẩm sale"
          link={{ label: "Xem tất cả sản phẩm sale", href: "/products?is_sale=1" }}
        />
        <HomeProducts result={sale} emptyText="Hiện chưa có sản phẩm khuyến mãi." />
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead eyebrow="Dịp sử dụng" title="Bạn cần đồ cho dịp nào?" />
        <OccasionGrid />
      </section>

      <section className="shell py-20 md:py-28">
        <EditorialBlock post={featuredPost} />
      </section>

      <section className="shell py-20 md:py-28">
        <Lookbook />
      </section>

      <section className="bg-warm py-20 md:py-28">
        <div className="shell">
          <SectionHead eyebrow="Quy trình" title="Thuê đồ đơn giản cùng StyleRent" />
          <HowItWorks />
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead eyebrow="Trải nghiệm" title="Khách hàng nói gì về StyleRent" />
        <ReviewWall />
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead eyebrow="Cam kết" title="Vì sao chọn StyleRent?" />
        <WhyRent />
      </section>
    </>
  );
}
