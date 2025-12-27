"use client";
import NotFoundPage from "@/components/NotFoundPage";
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import ArticleCard from "./_components/ArticleCard";
import { ArticleListSkeleton } from "@/components/article/ArticleListSkeleton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Articles = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  
  const { isAuthenticated, isAuthInitialized } = useAuthStore();

  const currentCategory = searchParams.get("category") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts?${params.toString()}`
      );
      const { posts, pagination: meta } = res.data.data;
      setArticles(posts);
      setPagination(meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthInitialized && isAuthenticated) {
      fetchArticles();
    }
  }, [isAuthInitialized, isAuthenticated, fetchArticles]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ q: searchQuery || null });
  };

  const categories = ["all", "technology", "lifestyle", "business", "coding"]; // Example categories

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-12">
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Exploration
              </h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Discover stories, thinking, and expertise from writers on any topic.
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search articles, authors, tags..."
                className="pl-11 pr-4 h-12 bg-secondary/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateQueryParams({ category: cat === "all" ? null : cat })}
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

          <div className="space-y-6">
            {loading ? (
              <ArticleListSkeleton count={5} />
            ) : articles.length === 0 ? (
              <div className="py-20">
                <NotFoundPage content={searchQuery ? `No matches found for "${searchQuery}"` : "No articles found"} />
              </div>
            ) : (
              <div className="grid gap-6">
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
                    date={article.createdAt}
                    estimatedReadTime={Math.ceil(
                      article.content.trim().split(/\s+/).length / 200
                    )}
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
                        if (pagination.hasPrevPage) updateQueryParams({ page: (currentPage - 1).toString() });
                      }}
                      className={!pagination.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
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
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
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
                        if (pagination.hasNextPage) updateQueryParams({ page: (currentPage + 1).toString() });
                      }}
                      className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
