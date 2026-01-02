"use client";
import ArticleCard from "@/app/(protected)/article/_components/ArticleCard";
import FeaturedArticle from "@/app/(protected)/article/_components/FeaturedArticle";
import {
  ArticleListSkeleton,
  FeaturedArticleSkeleton,
} from "@/components/article/ArticleListSkeleton";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHome } from "@/hooks/useHome";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  "Technology",
  "Lifestyle",
  "Finance",
  "Productivity",
  "Design",
  "Travel",
  "Food",
  "Health",
];

const Index = () => {
  const { loading, recentArticles, featuredArticle } = useHome();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        {/* Categories */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/article?category=${category.toLowerCase()}`}
                  className="px-4 py-2 hover:bg-accent/90 hover:text-white transition-colors duration-300 ease-in-out rounded-full bg-white shadow-sm text-sm font-medium"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* Featured Article */}
        {loading || !featuredArticle ? (
          <FeaturedArticleSkeleton />
        ) : (
          <FeaturedArticle
            slug={featuredArticle.slug}
            title={featuredArticle.title}
            shortDescription={featuredArticle.shortDescription}
            coverImage={featuredArticle.coverImage}
            author={featuredArticle.author}
            category={featuredArticle.category}
            date={featuredArticle.createdAt}
            estimatedReadTime={
              featuredArticle.content
                ? Math.ceil(
                    featuredArticle.content.trim().split(/\s+/).length / 200
                  )
                : 0
            }
          />
        )}
        {/* Recent Articles */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 max-w-[1600px]">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Recent Articles
              </h2>
              <Link href="/article">
                <Button variant="ghost" className="group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            {loading ? (
              <ArticleListSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {recentArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    slug={article.slug}
                    title={article.title}
                    excerpt={article.shortDescription}
                    coverImage={article.coverImage}
                    author={article.author}
                    category={article.category}
                    date={article.createdAt}
                    estimatedReadTime={Math.ceil(
                      article.content.trim().split(/\s+/).length / 200
                    )}
                    featured={article.isFeatured}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Newsletter */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-navy/5 to-lavender/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
                Get thoughtful insights delivered to your inbox
              </h2>
              <p className="text-muted-foreground mb-8 md:text-lg">
                Join our newsletter and discover new voices and ideas. No spam,
                just quality content.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  className="px-4 py-3 rounded-full flex-1 border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  type="email"
                  placeholder="Your email address"
                />
                <Button className="rounded-full px-6">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
