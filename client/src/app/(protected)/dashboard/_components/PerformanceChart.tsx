import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Eye } from "lucide-react";
import Link from "next/link";
import type { Article } from "../_hooks/use-dashboard-data";

interface PerformanceChartProps {
  articles: Article[];
}

export function PerformanceChart({ articles }: PerformanceChartProps) {
  if (articles.length === 0) {
    return (
      <Card className="rounded-2xl border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Top Performing Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No articles to display yet
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxViews = Math.max(...articles.map((a) => a.views || 0));

  return (
    <Card className="rounded-2xl border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          Top Performing Articles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {articles.map((article, index) => {
          const views = article.views || 0;
          const percentage = maxViews > 0 ? (views / maxViews) * 100 : 0;

          return (
            <div key={article.id} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/article/${article.slug}`}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium hover:text-primary transition-colors line-clamp-2">
                    <span className="text-muted-foreground mr-2">
                      {index + 1}.
                    </span>
                    {article.title}
                  </p>
                </Link>
                <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                  <Eye size={14} />
                  <span className="font-semibold">{views}</span>
                </div>
              </div>
              <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
