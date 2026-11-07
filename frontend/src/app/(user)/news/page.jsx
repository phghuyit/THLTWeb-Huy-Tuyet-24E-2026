"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { postService } from "@/services/postService";
import { formatDate } from "@/lib/date";
import { IconSearch } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Primitives";
import { Pagination } from "@/components/ui/DataTable";

const POSTS_PER_PAGE = 6;

export default function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [postsData, catsData] = await Promise.all([
          postService.getPosts(),
          postService.getCategories(),
        ]);
        if (active) {
          setPosts(postsData);
          setCategories(catsData);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchCategory =
      selectedCategory === "all" ||
      post.category?.slug === selectedCategory ||
      post.categorySlug === selectedCategory;

    const query = searchQuery.trim().toLowerCase();
    const matchSearch =
      !query ||
      post.title?.toLowerCase().includes(query) ||
      post.summary?.toLowerCase().includes(query);

    return matchCategory && matchSearch;
  });

  const featuredPost =
    selectedCategory === "all" && !searchQuery.trim()
      ? filteredPosts.find((p) => p.is_hot) || filteredPosts[0]
      : null;

  const standardPosts = featuredPost
    ? filteredPosts.filter((p) => p.id !== featuredPost.id)
    : filteredPosts;

  const totalPages = Math.ceil(standardPosts.length / POSTS_PER_PAGE);
  const paginatedStandardPosts = standardPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  return (
    <div className="pt-[76px]">
      <header className="shell border-b border-line py-16 md:py-20">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow text-ink-3">Tạp chí & Cẩm nang</p>
          <h1 className="display-1 mt-5">Tin tức thời trang</h1>
          <p className="lede mt-6 max-w-[62ch]">
            Khám phá xu hướng thời trang mới nhất, cẩm nang phối đồ dự tiệc và kinh nghiệm thuê trang phục thông minh.
          </p>
        </Reveal>
      </header>

      <div className="shell py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-ink text-canvas"
                : "border border-line bg-surface text-ink-2 hover:bg-line/40 hover:text-ink"
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-ink text-canvas"
                  : "border border-line bg-surface text-ink-2 hover:bg-line/40 hover:text-ink"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-4 text-xs text-ink placeholder:text-ink-3 outline-none focus:border-accent"
          />
          <IconSearch
            width={14}
            height={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <p className="text-sm text-ink-2">Đang tải các bài viết mới nhất...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface p-12 text-center max-w-md mx-auto my-12">
          <p className="font-medium text-ink mb-1">Không tìm thấy bài viết phù hợp</p>
          <p className="text-xs text-ink-3 mb-4">
            Hãy thử tìm bằng từ khóa khác hoặc chuyển sang danh mục khác.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="btn btn-outline btn-sm text-xs"
          >
            Xem tất cả bài viết
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {featuredPost && (
            <article className="overflow-hidden rounded-xl border border-line bg-surface transition-shadow hover:shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto min-h-[280px]">
                  <img
                    src={
                      featuredPost.thumbnail ||
                      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={featuredPost.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                    Bài viết nổi bật
                  </span>
                </div>
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-ink-3 mb-3">
                      <span>{featuredPost.category?.name || "Tin tức"}</span>
                      <span>·</span>
                      <span>{formatDate(featuredPost.created_at?.slice(0, 10))}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink hover:text-accent transition-colors">
                      <Link href={`/news/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-xs sm:text-sm text-ink-2 leading-relaxed line-clamp-3">
                      {featuredPost.summary}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
                    <span className="text-xs text-ink-3">
                      Bởi {featuredPost.author?.fullname || "StyleRent"}
                    </span>
                    <Link
                      href={`/news/${featuredPost.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                    >
                      <span>Đọc tiếp</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedStandardPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <Link href={`/news/${post.slug}`} className="relative h-48 w-full overflow-hidden">
                  <img
                    src={
                      post.thumbnail ||
                      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded bg-canvas/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-ink">
                    {post.category?.name || "Thời trang"}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <p className="text-[11px] text-ink-3 mb-2">
                      {formatDate(post.created_at?.slice(0, 10))}
                    </p>
                    <h3 className="font-serif text-lg font-bold text-ink leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      <Link href={`/news/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2.5 text-xs text-ink-2 leading-relaxed line-clamp-2">
                      {post.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                    <span className="text-ink-3">
                      {post.author?.fullname || "Ban biên tập"}
                    </span>
                    <Link
                      href={`/news/${post.slug}`}
                      className="font-medium text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Xem chi tiết</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={standardPosts.length}
            pageSize={POSTS_PER_PAGE}
            onPageChange={setPage}
            className="mt-8 rounded-lg border border-line bg-surface"
          />
        </div>
      )}
      </div>
    </div>
  );
}
