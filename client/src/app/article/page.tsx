"use client";
import { useEffect, useState } from "react";
import ArticleCard from "./_components/ArticleCard";
import axios from "axios";
import { set } from "zod";

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
    const res = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
    res
      .then((response) => {
        const articles = response.data.data.posts;
        console.log("Fetched articles:", articles);
        setArticles(articles);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
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
