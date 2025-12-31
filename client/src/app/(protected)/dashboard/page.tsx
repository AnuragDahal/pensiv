"use client";

import { useDashboardData } from "./_hooks/use-dashboard-data";
import { StatsCards } from "./_components/StatsCards";
import { QuickActions } from "./_components/QuickActions";
import { RecentArticlesTable } from "./_components/RecentArticlesTable";
import { PerformanceChart } from "./_components/PerformanceChart";
import { CategoryDistribution } from "./_components/CategoryDistribution";
import { ActivityFeed } from "./_components/ActivityFeed";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AlertCircle, LayoutDashboard } from "lucide-react";
import DashboardSkeleton from "./_components/DashBoardSkeleton";

export default function DashboardPage() {
  const { data, loading, error, user, refetch } = useDashboardData();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <Card className="rounded-2xl border-destructive/50">
            <CardContent className="py-12 text-center">
              <AlertCircle
                size={48}
                className="mx-auto mb-4 text-destructive"
              />
              <h3 className="text-lg font-semibold mb-2">
                Error loading dashboard
              </h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Handle empty state for new users
  const isNewUser = data && data.stats.totalArticles === 0;

  if (isNewUser) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <Breadcrumb className="mb-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <LayoutDashboard className="text-primary" size={32} />
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome, {user?.name}! Get started by creating your first article.
            </p>
          </div>

          {/* Empty State */}
          <Card className="rounded-2xl">
            <CardContent className="py-16 text-center">
              <LayoutDashboard
                size={64}
                className="mx-auto mb-6 text-muted-foreground/50"
              />
              <h3 className="text-2xl font-semibold mb-3">
                Welcome to Your Dashboard
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You haven't created any articles yet. Start writing to see your stats, analytics, and performance metrics here.
              </p>
              <Link
                href="/article/create"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Create Your First Article
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <QuickActions />
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
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold">
                  Recent Articles
                </h2>
                <Link href="/my-articles">
                  <span className="text-sm text-primary hover:underline cursor-pointer">
                    View All Articles
                  </span>
                </Link>
              </div>
              <RecentArticlesTable
                articles={data.recentArticles}
                onArticleDeleted={refetch}
              />
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
