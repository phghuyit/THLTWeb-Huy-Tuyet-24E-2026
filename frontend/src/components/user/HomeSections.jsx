"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductMedia } from "./ProductMedia";
import { IconArrowRight } from "@/components/ui/Icons";
import { Reveal, Stars } from "@/components/ui/Primitives";
import { OCCASIONS } from "@/data/catalog";
import { EDITORIAL, HOW_IT_WORKS, LOOKBOOK, MARQUEE_WORDS, WHY_RENT } from "@/data/content";
import { getProduct } from "@/data/products";
import { reviewService } from "@/services/reviewService";
import { cn } from "@/lib/utils";

export function SectionHead({
  eyebrow,
  title,
  link,
  className,
  align = "between",
}) {
  return (
    <Reveal
      as="header"
      className={cn(
        "flex gap-6 pb-10",
        align === "between" ? "flex-col md:flex-row md:items-end md:justify-between" : "flex-col items-center text-center",
        className,
      )}
    >
      <div className={align === "center" ? "max-w-[52ch]" : "max-w-[26ch]"}>
        <p className="eyebrow text-ink-3">{eyebrow}</p>
        <h2 className="display-2 mt-4">{title}</h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="link-line link-underline-in inline-flex shrink-0 items-center gap-2 text-[11.5px] uppercase tracking-[0.14em]"
        >
          {link.label}
          <IconArrowRight width={15} height={15} />
        </Link>
      )}
    </Reveal>
  );
}

export function Marquee() {
  const words = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="overflow-hidden border-y border-line bg-warm py-5">
      <div className="marquee-track" style={{ "--marquee-duration": "48s" }}>
        {words.map((word, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="font-display text-[26px] tracking-[-0.01em] text-ink/85 md:text-[32px]">{word}</span>
            <span className="mx-8 h-1 w-1 rounded-full bg-accent/70 md:mx-11" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function CategoryStrip({ categories = [] }) {

  const spans = ["md:col-span-5", "md:col-span-3", "md:col-span-4"];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12">
      {categories.map((category, i) => (
        <Reveal key={category.id} as="div" delay={i * 70} className={cn("group", spans[i] || "md:col-span-4")}>
          <Link href={`/products?category=${encodeURIComponent(category.slug)}`} className="block">
            <ProductMedia
              image={category.preview_image || category.image}
              alt={category.name}
              ratio={i < 2 ? "4/5" : "3/4"}
            />
            <div className="flex items-baseline justify-between gap-4 pt-4">
              <h3 className="display-4">{category.name}</h3>
              <span className="text-[11.5px] uppercase tracking-[0.12em] text-ink-3 transition-transform duration-500 ease-luxe group-hover:translate-x-1">
                Xem →
              </span>
            </div>
            <p className="mt-1.5 text-[12px] text-ink-3">{category.products_count} sản phẩm</p>
            {category.description && (
              <p className="mt-1.5 max-w-[46ch] text-[13px] leading-relaxed text-ink-2">{category.description}</p>
            )}
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function OccasionGrid() {
  return (
    <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
      {OCCASIONS.map((occasion, i) => (
        <Reveal key={occasion.slug} as="div" delay={i * 55}>
          <Link
            href={`/products?occasion=${occasion.slug}`}
            className="group flex h-full flex-col justify-between gap-8 bg-canvas p-7 transition-colors duration-400 hover:bg-warm"
          >
            <span className="eyebrow text-ink-3">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="display-4 block">{occasion.name}</span>
              <span className="mt-1.5 block text-[13px] text-ink-2">{occasion.blurb}</span>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function EditorialBlock({ post }) {
  const eyebrow = post?.category?.name || (post ? "Bài viết nổi bật" : EDITORIAL.eyebrow);
  const title = post?.title || EDITORIAL.title;
  const body = post?.summary || (post?.content ? post.content.replace(/<[^>]+>/g, "").slice(0, 220) + "..." : EDITORIAL.body);
  const ctaHref = post ? `/news/${post.slug || post.id}` : EDITORIAL.cta.href;
  const ctaLabel = post ? "Đọc bài viết" : EDITORIAL.cta.label;

  return (
    <div className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
      <Reveal as="div" className="md:col-span-7">
        {post?.thumbnail ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-line bg-surface shadow-md group">
            <img
              src={post.thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ) : (
          <ProductMedia
            image={{
              id: "editorial-campaign",
              motif: "runway",
              tone: ["#7c2230", "#f2e7dd"],
              alt: title,
            }}
            ratio="4/5"
          />
        )}
      </Reveal>
      <Reveal as="div" delay={140} className="md:col-span-5">
        <p className="eyebrow text-ink-3">{eyebrow}</p>
        <h2 className="display-2 mt-5">{title}</h2>
        <p className="lede mt-6">{body}</p>
        <Link href={ctaHref} className="btn btn-outline mt-9 inline-flex items-center gap-2 group">
          <span>{ctaLabel}</span>
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </Link>
      </Reveal>
    </div>
  );
}

export function HowItWorks() {
  return (
    <div className="grid gap-px bg-line md:grid-cols-4">
      {HOW_IT_WORKS.map((step, i) => (
        <Reveal key={step.step} as="div" delay={i * 80} className="bg-canvas p-7 md:p-8">
          <p className="font-display text-[40px] leading-none text-accent/35">{step.step}</p>
          <h3 className="display-4 mt-6">{step.title}</h3>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">{step.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function WhyRent() {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-x-16">
      {WHY_RENT.map((item, i) => (
        <Reveal key={item.title} as="div" delay={i * 70} className="border-t border-line pt-6">
          <h3 className="display-4">{item.title}</h3>
          <p className="mt-3 max-w-[52ch] text-[13.5px] leading-relaxed text-ink-2">{item.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function ReviewWall() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadReviews() {
      try {
        const data = await reviewService.getReviews({ status: "approved" });
        if (active && Array.isArray(data) && data.length > 0) {
          setReviews(data.slice(0, 4));
        }
      } catch {
      }
    }
    loadReviews();
    return () => {
      active = false;
    };
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-px bg-line md:grid-cols-2 xl:grid-cols-4">
      {reviews.map((review, i) => {
        return (
          <Reveal key={review.id} as="figure" delay={i * 70} className="flex h-full flex-col bg-canvas p-7">
            <Stars value={review.rating} size={13} />
            <blockquote className="mt-5 flex-1 text-[14px] leading-relaxed">“{review.content}”</blockquote>
            <figcaption className="mt-6 border-t border-line pt-4">
              <p className="text-[13px] font-medium text-ink">{review.author || "Khách hàng"}</p>
              {review.product_name && (
                <Link
                  href={review.product_slug ? `/products/${review.product_slug}` : "/products"}
                  className="link-line link-underline-in mt-1 block text-[12px] text-ink-2 truncate"
                >
                  {review.product_name}
                  {(review.size_worn || review.sizeWorn) ? ` · size ${review.size_worn || review.sizeWorn}` : ""}
                </Link>
              )}
            </figcaption>
          </Reveal>
        );
      })}
    </div>
  );
}

export function Lookbook() {
  return (
    <div className="no-scrollbar -mx-[clamp(1.25rem,4vw,4rem)] flex snap-x gap-3 overflow-x-auto px-[clamp(1.25rem,4vw,4rem)] lg:mx-0 lg:grid lg:grid-cols-6 lg:px-0">
      {LOOKBOOK.map((item, i) => {
        const product = getProduct(item.slug);
        if (!product) return null;
        return (
          <Reveal key={item.handle + i} as="div" delay={i * 60} className="w-[46vw] shrink-0 snap-start sm:w-[30vw] lg:w-auto">
            <Link href={`/products?selected=${product.slug}`} className="group block">
              <ProductMedia image={product.images[(i + 2) % product.images.length]} ratio="1/1" />
              <p className="mt-3 text-[12px]">{item.handle}</p>
              <p className="text-[11.5px] text-ink-3">{item.caption}</p>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
