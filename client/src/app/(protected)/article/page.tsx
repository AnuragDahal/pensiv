"use client";
import NotFoundPage from "@/components/NotFoundPage";
import { useAuthStore } from "@/store/auth-store";
import ArticleCard from "./_components/ArticleCard";
import { ArticleListSkeleton } from "@/components/article/ArticleListSkeleton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { calculateReadingTime } from "@/lib/utils";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS, ARTICLE_CATEGORIES } from "@/lib/constants";

interface Author {
  name: string;
  avatar: string;
}
interface Article {
  id: string;
  slug: string;
  title: string;
  author: Author;
  shortDescription: string;
  coverImage: string;
  category: string;
  createdAt: string;
  content: string;
  isFeatured?: boolean;
}

const Articles = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isAuthenticated, isAuthInitialized } = useAuthStore();
  const searchQuery = searchParams.get("q") || "";

  const currentCategory = searchParams.get("category") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Fetch articles with React Query for automatic caching
  const { data: articlesData, isLoading: queryLoading } = useQuery({
    queryKey: ["articles", currentCategory, currentPage, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (currentCategory && currentCategory !== "all") {
        params.set("category", currentCategory);
      }
      params.set("page", currentPage.toString());

      // Send search query to backend for full database search
      if (searchQuery) {
        params.set("q", searchQuery);
      }

      const res = await apiClient.get(
        API_ENDPOINTS.POSTS.SEARCH(params.toString() ?? "")
      );
      return res.data.data;
    },
    enabled: isAuthInitialized && isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Show loading while auth is initializing or query is loading
  const loading = !isAuthInitialized || queryLoading;

  // Get articles directly from backend (backend handles search)
  const articles: Article[] = articlesData?.posts || [];
  const pagination = articlesData?.pagination || null;

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 on search or filter change
    if (updates.q !== undefined || updates.category !== undefined) {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const categories = ["all", ...ARTICLE_CATEGORIES];

  return (
    <div className="min-h-screen bg-background px-6 py-8 sm:px-8 md:px-10 lg:px-12 xl:px-16 mt-12">
      <div className="max-w-[1600px] mx-auto space-y-12">
        <section className="space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Exploration
            </h2>
            <p className="text-muted-foreground text-lg max-w-md">
              Discover stories, thinking, and expertise from writers on any
              topic.
            </p>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  updateQueryParams({ category: cat === "all" ? null : cat })
                }
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  currentCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div>
            {loading ? (
              <ArticleListSkeleton count={5} />
            ) : articles.length === 0 ? (
              <div className="py-20">
                <NotFoundPage
                  content={
                    searchQuery
                      ? `No matches found for "${searchQuery}"`
                      : "No articles found"
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    slug={article.slug}
                    title={article.title}
                    excerpt={article.shortDescription}
                    coverImage={article.coverImage}
                    author={{
                      name: article.author?.name || "Anonymous",
                      avatar: article.author?.avatar || "",
                    }}
                    category={article.category}
                    estimatedReadTime={calculateReadingTime(article.content)}
                    featured={article.isFeatured}
                  />
                ))}
              </div>
            )}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.hasPrevPage)
                          updateQueryParams({
                            page: (currentPage - 1).toString(),
                          });
                      }}
                      className={
                        !pagination.hasPrevPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => {
                    // Simple pagination: show all or logic for ellipsis if many
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              updateQueryParams({ page: page.toString() });
                            }}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.hasNextPage)
                          updateQueryParams({
                            page: (currentPage + 1).toString(),
                          });
                      }}
                      className={
                        !pagination.hasNextPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Articles;
