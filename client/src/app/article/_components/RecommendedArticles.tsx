import { Recommended } from "@/types/article";
import Image from "next/image";
import Link from "next/link";

interface RecommendedArticlesProps {
  articles: Array<Recommended>;
}

const RecommendedArticles = ({ articles }: RecommendedArticlesProps) => {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-20 bg-gray-50 py-16 rounded-3xl">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Recommended for you
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((rec) => (
            <Link
              key={rec.id}
              href={`/article/${rec.id}`}
              className="block group"
            >
              <article className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Image
                    src={rec.author.avatar ?? null}
                    alt={rec.author.name??"author"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {rec.author.name}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {rec.title}
                </h3>
                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                  {rec.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedArticles;
