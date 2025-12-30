// src/app/article/[id]/page.tsx
"use client";
import ArticleRenderer from "@/components/article/ArticleRenderer";
import ArticleSkeleton from "@/components/article/ArticleSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useArticle } from "@/hooks/useArticle";
import { useComment } from "@/hooks/useComment";
import { getInitials } from "@/lib/utils";
import { ArticleResponse } from "@/types/article";
import Image from "next/image";
import { useParams } from "next/navigation";
import AddComment from "../_components/AddComment";
import { CommentList } from "../_components/CommentList";
import { LikeButton } from "../_components/like-button";
import RecommendedArticles from "../_components/RecommendedArticles";
import { ShareButton } from "../_components/share-button";
import Profile from "@/components/profile";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, refetch, togglePostLikes, toggleCommentLike } = useArticle(slug!);
  const { addComment } = useComment(refetch);
  const article = data as ArticleResponse;

  const isInitialLoading = loading && !data; // first load only
  if (isInitialLoading) return <ArticleSkeleton />;

  if (!data) return null; // fail-safe after first load

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* ----- Hero Section ----- */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-8">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {article.post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            {article.post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-gray-100">
            <div className="flex items-center gap-3">
              <Profile
                name={article.post.author.name}
                avatar={article.post.author.avatar}
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {article.post.author.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>
                    {new Date(article.post.createdAt).toLocaleDateString(
                      undefined,
                      { month: "long", day: "numeric", year: "numeric" }
                    )}
                  </span>
                  <span>•</span>
                  <span>
                    {Math.ceil(article.post.content.length / 200)} min read
                  </span>
                </div>
              </div>
            </div>
            {/* Post Tool Bar */}
            <div className="flex items-center gap-2">
              <LikeButton
                likes={article.likes}
                onToggle={togglePostLikes}
                id={article.post.id}
              />
              <ShareButton
                title={article.post.title}
                text={article.post.title}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ----- Thumbnail Placeholder ----- */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative">
          <Image
            src={article.post.coverImage ?? null}
            alt={article.post.title ?? "cover"}
            width={1200}
            height={675}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ----- Content ----- */}

      <ArticleRenderer content={article.post.content} />

      {/* ----- Comments Section ----- */}
      <section className="max-w-3xl mx-auto px-4 mt-12">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            {article.comments.length}
          </span>
        </div>
        <AddComment onAddComment={addComment} articleId={article.post.id} />
        <div className="space-y-8 mt-8">
          {article.comments.length === 0 ? (
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
              postId={article.post.id}
            />
          )}
        </div>
      </section>

      {/* ----- Recommended Articles ----- */}
      {article.recommended.length > 0 && (
        <RecommendedArticles articles={article.recommended} />
      )}
    </main>
  );
}
