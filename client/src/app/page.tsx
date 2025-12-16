"use client";
import ArticleCard from "@/app/article/_components/ArticleCard";
import FeaturedArticle from "@/app/article/_components/FeaturedArticle";
import { ArticleListSkeleton } from "@/components/article/ArticleListSkeleton";
import ArticleSkeleton from "@/components/article/ArticleSkeleton";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPanel } from "@/components/user-panel";
import { useAuth } from "@/hooks/use-auth";
import { useHome } from "@/hooks/useHome";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
// Mock data for featured article
const featuredArticle = {
  id: "1",
  title: "The Future of Web Design: Minimalism Meets Functionality",
  slug: "the-future-of-web-design-minimalism-meets-functionality",
  excerpt:
    "Explore how modern web design is embracing minimalism while enhancing user experience and functionality. Discover the key principles driving this design evolution.",
  coverImage:
    "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1074&auto=format&fit=crop",
  author: {
    name: "Alex Morgan",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww",
  },
  category: "Design",
  date: "May 20, 2023",
  estimatedReadTime: 8,
};
interface Author {
  name: string;
  avatar: string;
}
interface Article {
  id: string;
  slug: string;
  title: string;
  author: Author;
  shortDescription: string;
  coverImage: string;
  category: string;
  createdAt: string;
  content: string;
  featured?: boolean;
}
// Mock data for articles
const articles: Article[] = [
  {
    id: "2",
    slug: "the-art-of-productivity-achieving-more-with-less",
    title: "The Art of Productivity: Achieving More with Less",
    shortDescription:
      "Discover the secrets to maximizing your productivity without burning out. Learn practical strategies that successful people use.",
    coverImage:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop",
    author: {
      name: "Sara Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    },
    category: "Productivity",
    createdAt: "May 18, 2023",
    content: "",
    featured: false,
  },
  {
    id: "3",
    slug: "sustainable-living-small-changes-big-impact",
    title: "Sustainable Living: Small Changes, Big Impact",
    shortDescription:
      "How small daily choices can lead to significant environmental benefits. Practical tips for a more sustainable lifestyle.",
    coverImage:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1474&auto=format&fit=crop",
    author: {
      name: "Mike Williams",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60",
    },
    category: "Lifestyle",
    createdAt: "May 15, 2023",
    content: "",
    featured: false,
  },
  {
    id: "4",
    slug: "the-science-of-better-sleep-research-backed-strategies",
    title: "The Science of Better Sleep: Research-Backed Strategies",
    shortDescription:
      "Recent research findings on what really helps improve sleep quality. Evidence-based techniques you can apply tonight.",
    coverImage:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1460&auto=format&fit=crop",
    author: {
      name: "Jasmine Lee",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60",
    },
    category: "Health",
    createdAt: "May 12, 2023",
    content: "",
    featured: false,
  },
  {
    id: "5",
    slug: "financial-freedom-building-wealth-on-any-income",
    title: "Financial Freedom: Building Wealth on Any Income",
    shortDescription:
      "Practical financial advice that works regardless of your current income level. Build wealth step by step with these proven methods.",
    coverImage:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1471&auto=format&fit=crop",
    author: {
      name: "Daniel Thompson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
    },
    category: "Finance",
    createdAt: "May 10, 2023",
    content: "",
    featured: false,
  },
  {
    id: "6",
    slug: "the-future-of-ai-in-everyday-life",
    title: "The Future of AI in Everyday Life",
    shortDescription:
      "How artificial intelligence is quietly transforming our daily routines and what to expect in the coming years.",
    coverImage:
      "https://images.unsplash.com/photo-1677442135136-760c813070c8?q=80&w=1632&auto=format&fit=crop",
    author: {
      name: "Rachel Kim",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
    },
    category: "Technology",
    createdAt: "May 8, 2023",
    content: "",
    featured: false,
  },
];

const categories = [
  "Technology",
  "Design",
  "Health",
  "Finance",
  "Lifestyle",
  "Productivity",
  "Travel",
  "Food",
];

const Index = () => {
  const { loading, recentArticles, featuredArticle } = useHome();
  const { isAuthenticated, user } = useAuth();
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
                  href={`/category/${category.toLowerCase()}`}
                  className="px-4 py-2 rounded-full bg-white shadow-sm hover:shadow transition-shadow text-sm font-medium"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* Featured Article */}
        {loading || !featuredArticle ? (
          <ArticleListSkeleton count={1} />
        ) : (
          <FeaturedArticle
            slug={featuredArticle.slug}
            title={featuredArticle.title}
            shortDescription={featuredArticle.shortDescription}
            coverImage={featuredArticle.coverImage}
            author={featuredArticle.author}
            category={featuredArticle.category}
            date={featuredArticle.createdAt}
            estimatedReadTime={Math.ceil(
              featuredArticle.content.split(" ").length / 200
            )}
          />
        )}
        {/* Recent Articles */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="min-h-scrren bg-background p-6 md:p-10">
              <div className="max-w-7xl mx-auto space-y-16">
                {loading ? (
                  <ArticleListSkeleton count={4} />
                ) : (
                  recentArticles.map((article) => (
                    <div
                      key={article.id}
                      className="animate-fade-in"
                      style={{
                        animationDelay: `${(parseInt(article.id) - 2) * 100}ms`,
                      }}
                    >
                      <ArticleCard
                        slug={article.slug}
                        title={article.title}
                        excerpt={article.shortDescription}
                        coverImage={article.coverImage}
                        author={article.author}
                        category={article.category}
                        date={article.createdAt}
                        estimatedReadTime={Math.ceil(
                          article.content.split(" ").length / 200
                        )}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
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
        {isAuthenticated && (
          <UserPanel userName={user?.name} userEmail={user?.email} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
