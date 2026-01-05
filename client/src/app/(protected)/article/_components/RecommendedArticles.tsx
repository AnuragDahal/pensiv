import { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";
import { calculateReadingTime } from "@/lib/utils";

interface RecommendedArticlesProps {
  articles: Array<Article>;
}

const RecommendedArticles = ({ articles }: RecommendedArticlesProps) => {
  return (
    <section className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 mt-20 bg-gray-50 py-8 rounded-3xl">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Recommended For You
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {articles.map((rec) => (
          <ArticleCard
            key={rec.id}
            title={rec.title}
            slug={rec.slug}
            excerpt={rec.shortDescription}
            coverImage={rec.coverImage}
            author={rec.author}
            category={rec.category}
            estimatedReadTime={calculateReadingTime(rec.content)}
            featured={rec.isFeatured}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedArticles;
