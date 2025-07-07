"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ArticleCard from "./_components/ArticleCard";
import NotFoundPage from "@/components/NotFoundPage";
import ClassicLoader from "@/components/ui/classic-loader";
import { useAuthStore } from "@/store/auth-store";

interface Author {
  name: string;
  avatar: string;
}
interface Article {
  id: string;
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
        setLoading(!loading);
      }
    };
    fetchArticles();
  }, [isAuthInitialized, isAuthenticated]);
  return (
    <div className="mt-14 pt-4 md:pt-6 lg:pt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="flex items-center justify-center col-span-1 sm:col-span-2 lg:col-span-3 h-64">
            <ClassicLoader />
          </div>
        ) : articles.length === 0 ? (
          <NotFoundPage content="No articles found" />
        ) : (
          articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              excerpt={article.shortDescription}
              coverImage={article.coverImage}
              author={{
                name: article.userId.name,
                avatar: article.userId.avatar,
              }}
              category={article.category}
              date={new Date(article.createdAt).toLocaleDateString("en-us", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              estimatedReadTime={Math.ceil(
                article.content.split(" ").length / 200
              )}
              featured={article.featured}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Articles;
