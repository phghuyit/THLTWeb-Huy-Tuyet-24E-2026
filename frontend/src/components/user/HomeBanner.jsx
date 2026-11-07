"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeBanner({ banners = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const bannerList = Array.isArray(banners) && banners.length > 0 ? banners : [
    {
      title: "Bộ Sưu Tập Dạ Hội & Tiệc Cưới 2026",
      image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
      link_url: "/products",
    },
  ];

  useEffect(() => {
    if (bannerList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerList.length]);

  const activeBanner = bannerList[currentIndex] || bannerList[0];

  return (
    <section className="shell py-12 md:py-16">
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
        <Link
          href={activeBanner.link_url || "/products"}
          className="group block relative w-full aspect-[16/7] sm:aspect-[21/9] md:aspect-[24/9] min-h-[220px]"
        >
          <img
            key={activeBanner.image_url}
            src={activeBanner.image_url}
            alt={activeBanner.title || "Banner StyleRent"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-6 sm:px-12 md:px-16 text-white">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              StyleRent Collection
            </p>
            {activeBanner.title && (
              <h2 className="mt-2 max-w-[600px] font-display text-xl sm:text-3xl md:text-4xl font-normal leading-tight text-white drop-shadow-sm">
                {activeBanner.title}
              </h2>
            )}
            <div className="mt-4 sm:mt-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 border border-white/40 bg-white/10 px-4 py-2 text-xs uppercase tracking-wider backdrop-blur-sm transition-all group-hover:border-white group-hover:bg-white group-hover:text-ink">
                <span>Khám phá ngay</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            </div>
          </div>
        </Link>

        {bannerList.length > 1 && (
          <div className="absolute bottom-4 right-6 sm:right-10 flex items-center gap-1.5 z-10">
            {bannerList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Chuyển tới banner ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

