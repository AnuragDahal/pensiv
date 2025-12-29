"use client";

import { useDashboardData } from "./_hooks/use-dashboard-data";
import { StatsCards } from "./_components/StatsCards";
import { QuickActions } from "./_components/QuickActions";
import { RecentArticlesTable } from "./_components/RecentArticlesTable";
import { PerformanceChart } from "./_components/PerformanceChart";
import { CategoryDistribution } from "./_components/CategoryDistribution";
import { ActivityFeed } from "./_components/ActivityFeed";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data, loading, error, user } = useDashboardData();

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>

          {/* Quick Actions Skeleton */}
          <div className="flex gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-48 rounded-xl" />
            ))}
          </div>

          {/* Content Skeleton */}
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <Card className="rounded-2xl border-destructive/50">
            <CardContent className="py-12 text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Error loading dashboard</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-primary" size={32} />
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.name}! Here's your content overview.
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={data.stats} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 md:gap-8">
          {/* Left Column: Recent Articles */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Recent Articles
              </h2>
              <RecentArticlesTable articles={data.recentArticles} />
            </div>
          </div>

          {/* Right Column: Sidebar with Charts */}
          <div className="space-y-6">
            <PerformanceChart articles={data.topArticles} />
            <CategoryDistribution distribution={data.categoryDistribution} />
            <ActivityFeed activities={data.recentActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
