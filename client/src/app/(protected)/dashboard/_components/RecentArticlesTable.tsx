"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Edit2, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import type { Article } from "../_hooks/use-dashboard-data";

interface RecentArticlesTableProps {
  articles: Article[];
}

export function RecentArticlesTable({ articles }: RecentArticlesTableProps) {
  if (articles.length === 0) {
    return (
      <Card className="rounded-2xl border-border/50">
        <CardContent className="py-12 text-center">
          <FileText
            size={48}
            className="mx-auto mb-4 text-muted-foreground/50"
          />
          <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
          <p className="text-muted-foreground mb-4">
            Start writing your first article to see it here
          </p>
          <Link href="/article/create">
            <Button>Create Article</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold">
                  Article
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold">
                  Category
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold">
                  Status
                </th>
                <th className="text-center py-4 px-4 text-sm font-semibold">
                  Views
                </th>
                <th className="text-center py-4 px-4 text-sm font-semibold">
                  Likes
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold">
                  Published
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-muted/20 transition-colors"
                >
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
                      variant={
                        article.status === "published" ? "default" : "secondary"
                      }
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
                      <span className="font-medium">
                        {article.likesCount || 0}
                      </span>
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
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink size={16} />
                        </Button>
                      </Link>
                      <Link href={`/article/edit/${article.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
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
        {articles.map((article) => (
          <Card
            key={article.id}
            className="rounded-xl border-border/50 overflow-hidden"
          >
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
                      variant={
                        article.status === "published" ? "default" : "secondary"
                      }
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    View
                  </Button>
                </Link>
                <Link href={`/article/edit/${article.id}`} className="flex-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                  >
                    <Edit2 size={14} className="mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
