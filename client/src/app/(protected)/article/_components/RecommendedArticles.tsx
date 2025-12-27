import { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";

interface RecommendedArticlesProps {
  articles: Array<Article>;
}

const RecommendedArticles = ({ articles }: RecommendedArticlesProps) => {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-20 bg-gray-50 py-8 rounded-3xl">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Recommended For You
      </h2>
      <div className="space-y-6">
        {articles.map((rec) => (
          <ArticleCard
            key={rec.id}
            title={rec.title}
            slug={rec.slug}
            excerpt={rec.shortDescription}
            coverImage={rec.coverImage}
            author={rec.author}
            date={rec.createdAt}
            category={rec.category}
            estimatedReadTime={Math.ceil(
              rec.content.trim().split(/\s+/).length / 200
            )}
            featured={rec.isFeatured}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedArticles;
