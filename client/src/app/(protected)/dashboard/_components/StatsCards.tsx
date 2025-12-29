import { Card, CardContent } from "@/components/ui/card";
import { FileText, Heart, Eye, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import type { DashboardStats } from "../_hooks/use-dashboard-data";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statCards = [
    {
      label: "Articles Published",
      value: stats.totalArticles,
      icon: FileText,
      gradient: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500/20",
      trend: stats.monthlyGrowth.articles,
      trendLabel: "this month",
    },
    {
      label: "Total Likes",
      value: stats.totalLikes,
      icon: Heart,
      gradient: "from-red-500/10 to-red-500/5",
      iconColor: "text-red-500",
      borderColor: "border-red-500/20",
      trend: stats.monthlyGrowth.likes,
      trendLabel: "this month",
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      gradient: "from-green-500/10 to-green-500/5",
      iconColor: "text-green-500",
      borderColor: "border-green-500/20",
      trend: stats.monthlyGrowth.views,
      trendLabel: "this month",
    },
    {
      label: "Engagement Rate",
      value: `${stats.engagementRate}%`,
      icon: TrendingUp,
      gradient: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500/20",
      trend: 0,
      trendLabel: "average",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat) => (
        <Card
          key={stat.label}
          className={`rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden ${stat.borderColor}`}
        >
          <CardContent className={`p-6 bg-gradient-to-br ${stat.gradient}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold tracking-tight mb-3">
                  {stat.value}
                </p>
                {stat.trend !== 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trend > 0 ? (
                      <>
                        <ArrowUp size={14} className="text-green-600" />
                        <span className="text-green-600 font-semibold">
                          +{stat.trend}
                        </span>
                      </>
                    ) : stat.trend < 0 ? (
                      <>
                        <ArrowDown size={14} className="text-red-600" />
                        <span className="text-red-600 font-semibold">
                          {stat.trend}
                        </span>
                      </>
                    ) : null}
                    <span className="text-muted-foreground">{stat.trendLabel}</span>
                  </div>
                )}
              </div>
              <div
                className={`p-3 rounded-xl bg-background/50 ${stat.iconColor}`}
              >
                <stat.icon size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
