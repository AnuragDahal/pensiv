"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ArticleCard from "./_components/ArticleCard";

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
  const [articles, setArticles] = useState<Article[]>([
    {
      id: "",
      title: "",
      userId: {
        name: "",
        avatar: "",
      },
      category: "",
      shortDescription: "",
      coverImage: "",
      createdAt: "",
      content: "",
      featured: false,
    },
  ]);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
      const articlesData = res.data.data.posts;
      setArticles(articlesData);
    };
    fetchArticles();
  }, []);

  return (
    <div className="mt-14 pt-4 md:pt-6 lg:pt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            id={article.id}
            title={article.title}
            excerpt={article.shortDescription}
            coverImage={article.coverImage}
            author={{
              name: article.userId.name,
              avatar: article.userId.avatar,
            }}
            category={article.category || "General"}
            date={new Date(article.createdAt).toLocaleDateString() || "N/A"}
            estimatedReadTime={Math.ceil(
              article.content.split(" ").length / 200
            )}
            featured={article.featured}
          />
        ))}
      </div>
    </div>
  );
};

export default Articles;
