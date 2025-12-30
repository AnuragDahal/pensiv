"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Heart, Edit2, ExternalLink, FileText, Search, Filter } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  coverImage?: string;
  category: string;
  tags: string[];
  views: number;
  likesCount: number;
  status: "draft" | "published";
  createdAt: string;
  updatedAt?: string;
}

export default function MyArticlesPage() {
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setArticles(response.data.data || []);
        setFilteredArticles(response.data.data || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchArticles();
    }
  }, [accessToken]);

  useEffect(() => {
    let filtered = articles;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((article) => article.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, articles]);

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground">My Articles</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <FileText className="text-primary" size={32} />
            My Articles
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all your articles in one place ({filteredArticles.length} total)
          </p>
        </div>

        {/* Filters */}
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search by title, category, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger>
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Articles</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles Table */}
        {currentArticles.length === 0 ? (
          <Card className="rounded-2xl border-border/50">
            <CardContent className="py-12 text-center">
              <FileText size={48} className="mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start writing your first article"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Link href="/article/create">
                  <Button>Create Article</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-2xl border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold">Article</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold">Category</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold">Status</th>
                      <th className="text-center py-4 px-4 text-sm font-semibold">Views</th>
                      <th className="text-center py-4 px-4 text-sm font-semibold">Likes</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold">Date</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {currentArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {article.coverImage && (
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/article/${article.slug}`}
                                className="font-semibold hover:text-primary transition-colors line-clamp-1"
                              >
                                {article.title}
                              </Link>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {article.shortDescription}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary" className="capitalize">
                            {article.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={article.status === "published" ? "default" : "secondary"}
                          >
                            {article.status === "draft" ? "Draft" : "Published"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-sm">
                            <Eye size={16} className="text-muted-foreground" />
                            <span className="font-medium">{article.views || 0}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-sm">
                            <Heart size={16} className="text-muted-foreground" />
                            <span className="font-medium">{article.likesCount || 0}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">
                            {new Date(article.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/article/${article.slug}`}>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <ExternalLink size={16} />
                              </Button>
                            </Link>
                            <Link href={`/article/edit/${article.id}`}>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit2 size={16} />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {currentArticles.map((article) => (
                <Card key={article.id} className="rounded-xl border-border/50 overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {article.coverImage && (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <Link href={`/article/${article.slug}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 mb-1">
                            {article.title}
                          </h3>
                        </Link>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {article.category}
                          </Badge>
                          <Badge
                            variant={article.status === "published" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {article.status === "draft" ? "Draft" : "Published"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{article.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={14} />
                            <span>{article.likesCount || 0}</span>
                          </div>
                          <span className="text-xs">
                            {new Date(article.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                      <Link href={`/article/${article.slug}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          <ExternalLink size={14} className="mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/article/edit/${article.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          <Edit2 size={14} className="mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
