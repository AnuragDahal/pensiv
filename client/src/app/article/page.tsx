"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ArticleCard from "./_components/ArticleCard";
import NotFoundPage from "@/components/NotFoundPage";
import ClassicLoader from "@/components/ui/classic-loader";
import { useAuthStore } from "@/store/auth-store";
import ArticleSkeleton from "@/components/article/ArticleSkeleton";
import ArticleCardSkeleton from "@/components/article/ArticleCardSkeleton";

interface Author {
  name: string;
  avatar: string;
}
interface Article {
  id: string;
  slug: string;
  title: string;
  userId: Author;
  shortDescription: string;
  coverImage: string;
  category: string;
  createdAt: string;
  content: string;
  featured?: boolean;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated, isAuthInitialized } = useAuthStore();

  useEffect(() => {
    if (!isAuthInitialized) {
      // Initialize auth state if not already done
      return;
    }
    if (!isAuthenticated) {
      return;
    }
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts`
        );
        const articlesData = res.data.data.posts;
        setArticles(articlesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [isAuthInitialized, isAuthenticated]);
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-16">
        <section>
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Articles</h2>
            <p className="text-muted-foreground text-lg">
              Get the best articles from the best authors
            </p>
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center col-span-1 sm:col-span-2 lg:col-span-3 h-64">
                <ArticleSkeleton />
              </div>
            ) : articles.length === 0 ? (
              <NotFoundPage content="No articles found" />
            ) : (
              articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.shortDescription}
                  coverImage={article.coverImage}
                  author={{
                    name: article.userId.name,
                    avatar: article.userId.avatar,
                  }}
                  category={article.category}
                  date={new Date(article.createdAt).toLocaleDateString(
                    "en-us",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                  estimatedReadTime={Math.ceil(
                    article.content.split(" ").length / 200
                  )}
                  featured={article.featured}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Articles;
