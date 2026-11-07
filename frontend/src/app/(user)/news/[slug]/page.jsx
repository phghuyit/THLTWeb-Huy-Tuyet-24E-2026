"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { postService } from "@/services/postService";
import { formatDate } from "@/lib/date";
import { IconArrowLeft } from "@/components/ui/Icons";

export default function PostDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPostData() {
      try {
        const [postData, hotData] = await Promise.all([
          postService.getPostBySlug(slug),
          postService.getHotPosts(),
        ]);

        if (active) {
          setPost(postData);
          setRelatedPosts(hotData.filter((p) => p.slug !== slug).slice(0, 3));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPostData();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="shell py-24 text-center">
        <p className="text-sm text-ink-2">Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="shell py-24 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-serif font-bold text-ink mb-3">
          Không tìm thấy bài viết
        </h1>
        <p className="text-sm text-ink-2 mb-6">
          Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không chính
          xác.
        </p>
        <Link href="/news" className="btn btn-sm">
          Quay lại trang tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-12 md:py-16">
      <div className="max-w-3xl mx-auto mb-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-medium text-ink-2 hover:text-accent transition-colors mb-6"
        >
          <IconArrowLeft width={14} height={14} />
          <span>Tất cả tin tức & cẩm nang</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
            {post.category?.name || "Tin tức"}
          </span>
          <span className="text-xs text-ink-3">·</span>
          <span className="text-xs text-ink-3">
            {formatDate(post.created_at?.slice(0, 10))}
          </span>
          {post.views > 0 && (
            <>
              <span className="text-xs text-ink-3">·</span>
              <span className="text-xs text-ink-3">{post.views} lượt xem</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-ink leading-tight">
          {post.title}
        </h1>

        {post.summary && (
          <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed font-serif italic border-l-2 border-accent pl-4">
            {post.summary}
          </p>
        )}

        <div className="mt-6 pt-6 border-t border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-line text-sm font-bold text-ink">
              {(post.author?.fullname || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-ink">
                {post.author?.fullname || "Ban Biên Tập StyleRent"}
              </p>
              <p className="text-[11px] text-ink-3">Biên tập viên thời trang</p>
            </div>
          </div>
        </div>
      </div>

      {post.thumbnail && (
        <div className="max-w-4xl mx-auto mb-12 overflow-hidden rounded-2xl border border-line shadow-sm">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <article className="prose prose-neutral max-w-none text-ink text-sm sm:text-base leading-relaxed space-y-5">
          {post.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="space-y-4"
            />
          ) : (
            <p>Nội dung chi tiết đang được cập nhật.</p>
          )}
        </article>

        <div className="mt-12 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-ink-3">Chủ đề:</span>
            <span className="rounded bg-warm px-2.5 py-1 text-xs text-ink">
              #{post.category?.slug || "fashion"}
            </span>
            <span className="rounded bg-warm px-2.5 py-1 text-xs text-ink">
              #StyleRent
            </span>
          </div>

          <Link href="/products" className="btn btn-outline btn-sm text-xs">
            Khám phá tủ đồ thuê
          </Link>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="max-w-5xl mx-auto mt-20 pt-12 border-t border-line">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-ink">
              Các bài viết nổi bật khác
            </h2>
            <Link
              href="/news"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Xem tất cả &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:shadow-md"
              >
                <Link
                  href={`/news/${item.slug}`}
                  className="relative h-44 w-full overflow-hidden"
                >
                  <img
                    src={
                      item.thumbnail ||
                      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="p-4 flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-[11px] text-ink-3 mb-1.5">
                      {formatDate(item.created_at?.slice(0, 10))}
                    </p>
                    <h3 className="font-serif text-sm font-bold text-ink line-clamp-2 group-hover:text-accent transition-colors">
                      <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    </h3>
                  </div>
                  <Link
                    href={`/news/${item.slug}`}
                    className="mt-4 text-xs font-medium text-accent hover:underline"
                  >
                    Đọc tiếp &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
