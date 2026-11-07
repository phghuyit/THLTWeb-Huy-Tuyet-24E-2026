"use client";

import { useRef, useState } from "react";
import { ProductMedia } from "@/components/user/ProductMedia";
import { cn } from "@/lib/utils";

export function ImageGallery({ images = [], thumbnail, name }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);

  const rawList =
    Array.isArray(images) && images.length > 0
      ? images
      : thumbnail
      ? [{ id: "thumb", src: thumbnail, alt: name }]
      : [];

  const list =
    rawList.length > 0
      ? rawList.map((item, idx) => {
          const src =
            typeof item === "string"
              ? item
              : item?.image_url || item?.src || item?.url;
          return {
            ...(typeof item === "object" ? item : {}),
            id: item?.id || `img-${idx}`,
            src,
            alt: item?.alt || name,
          };
        })
      : [{ id: "fallback", motif: "portrait", tone: ["#6d4a44", "#efe6da"], alt: name }];

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== index) setIndex(next);
  }

  return (
    <>
      <div className="relative mx-auto sm:max-w-[520px] lg:hidden lg:max-w-none">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        >
          {list.map((image, i) => (
            <div key={image.id || i} className="w-full shrink-0 snap-center">
              <ProductMedia image={image} ratio="3/4" />
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 bg-surface/90 px-2.5 py-1 text-[11px] tabular-nums tracking-[0.08em]">
          {index + 1} / {list.length}
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {list.map((image, i) => (
            <button
              key={image.id || i}
              type="button"
              aria-label={`Ảnh ${i + 1}`}
              onClick={() => {
                trackRef.current?.scrollTo({ left: i * (trackRef.current?.clientWidth || 0), behavior: "smooth" });
              }}
              className={cn("h-0.5 w-6 transition-colors", i === index ? "bg-ink" : "bg-line")}
            />
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <ProductMedia image={list[0]} ratio="5/7" className="animate-image-reveal" />
          </div>
          {list.slice(1, 3).map((image, i) => (
            <ProductMedia key={image.id || i} image={image} ratio="3/4" />
          ))}
          {list[3] && (
            <div className={cn(list.length > 4 ? "col-span-1" : "col-span-2")}>
              <ProductMedia image={list[3]} ratio={list.length > 4 ? "3/4" : "16/9"} label={name} />
            </div>
          )}
          {list.slice(4).map((image, i) => (
            <div key={image.id || i + 4} className="col-span-1">
              <ProductMedia image={image} ratio="3/4" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
