"use client";
import ArticleRenderer from "@/components/article/ArticleRenderer";
import ArticleSkeleton from "@/components/article/ArticleSkeleton";
import { useArticle } from "@/hooks/useArticle";
import { useComment } from "@/hooks/useComment";
import { ArticleResponse } from "@/types/article";
import { useRouter } from "next/navigation";
import AddComment from "../_components/AddComment";
import { CommentList } from "../_components/CommentList";
import { LikeButton } from "../_components/like-button";
import { ShareButton } from "../_components/share-button";
import Profile from "@/components/profile";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import RecommendedArticles from "@/app/(protected)/article/_components/RecommendedArticles";
import Image from "next/image";

interface ArticleClientPageProps {
  slug: string;
}

export default function ArticleClientPage({ slug }: ArticleClientPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading, refetch, togglePostLikes, toggleCommentLike } =
    useArticle(slug);
  const { addComment } = useComment(refetch);

  const isInitialLoading = loading && !data;

  if (isInitialLoading) return <ArticleSkeleton />;

  // Ensure we have the complete article data before rendering
  if (!data || !data.post) return null;

  const article = data as ArticleResponse;
  const isAuthor = user?._id === article?.post?.author?.id;

  return (
    <main className="min-h-screen bg-white pb-20 mt-8">
      {/* ----- Hero Section ----- */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-8">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(article.post.tags || []).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            {article.post.title || "Untitled"}
          </h1>

          <div className="py-6 border-y border-gray-100 space-y-4">
            {/* Author Info Row */}
            <div className="flex items-center gap-3">
              <Profile
                name={article.post.author?.name || "Anonymous"}
                avatar={article.post.author?.avatar || ""}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {article.post.author?.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <span className="truncate">
                    {new Date(article.post.createdAt || Date.now()).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </span>
                  <span>•</span>
                  <span className="whitespace-nowrap">
                    {Math.ceil((article.post.content?.length || 0) / 200)} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <LikeButton
                  likes={article.likes || { count: 0, isLikedByUser: false }}
                  onToggle={togglePostLikes}
                  id={article.post.id || ""}
                />
                <ShareButton
                  title={article.post.title || ""}
                  text={article.post.title || ""}
                  image={article.post.coverImage || "/apple-touch-icon.png"}
                  description={
                    article.post.content
                      ? article.post.content
                          .replace(/<[^>]*>?/gm, "")
                          .replace(/[#*`]/g, "")
                          .substring(0, 100)
                          .trim() + "..."
                      : "Read this article on Pensiv"
                  }
                />
              </div>

              {/* Edit button on the right for authors */}
              {isAuthor && article.post.id && (
                <Button
                  onClick={() =>
                    router.push(`/article/edit/${article.post.id}`)
                  }
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full text-xs sm:text-sm px-3 sm:px-4"
                >
                  <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-medium">Edit</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ----- Thumbnail Placeholder ----- */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative">
          <Image
            src={article.post.coverImage || "/placeholder.svg"}
            alt={article.post.title || "cover"}
            width={1200}
            height={675}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ----- Content ----- */}

      <ArticleRenderer content={article.post.content || ""} />

      {/* ----- Comments Section ----- */}
      <section className="max-w-3xl mx-auto px-4 mt-12">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            {article.comments?.length || 0}
          </span>
        </div>
        <AddComment onAddComment={addComment} articleId={article.post.id || ""} />
        <div className="space-y-8 mt-8">
          {(!article.comments || article.comments.length === 0) ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-500 mt-2">
                No comments yet. Start the conversation!
              </p>
            </div>
          ) : (
            <CommentList
              comments={article.comments}
              onRefresh={refetch}
              onCommentLike={toggleCommentLike}
              postId={article.post.id || ""}
            />
          )}
        </div>
      </section>

      {/* ----- Recommended Articles ----- */}
      {article.recommended && article.recommended.length > 0 && (
        <RecommendedArticles articles={article.recommended} />
      )}
    </main>
  );
}
