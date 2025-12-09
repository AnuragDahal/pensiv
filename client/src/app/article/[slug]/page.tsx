// src/app/article/[id]/page.tsx
"use client";
import { useArticle } from "@/hooks/useArticle";
import { useAuthStore } from "@/store/auth-store";
import { ArticleResponse } from "@/types/article";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { LikeButton } from "../_components/like-button";
import { ShareButton } from "../_components/share-button";
import { MessageCircleIcon } from "lucide-react";
import RecommendedArticles from "../_components/RecommendedArticles";
import AddComment from "../_components/AddComment";
import { useComment } from "@/hooks/useComment";
import CommentList from "../_components/CommentList";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();
  const { data, loading, error, refetch } = useArticle(slug!);
  const { addComment } = useComment();
  if (!data) return null;
  const togglePostLike = async () => {
    if (!data) return;
    const endpoint = `/api/posts/${data.post.id}/like`;
    await axios.post(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    refetch(); // refresh counts
  };
  const article = data as ArticleResponse;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      </div>
    );

  // Remove duplicate H1 from content if it exists
  const cleanHtmlContent = article.post.htmlContent
    ? article.post.htmlContent.replace(/<h1[^>]*>.*?<\/h1>/i, "")
    : "";

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
              <Image
                src={article.post.author.avatar ?? null}
                alt={article.post.author.name}
                width={48}
                height={48}
                className="rounded-full object-cover border-2 border-white shadow-sm"
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
                    {Math.ceil(article.post.content.length / 1000)} min read
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LikeButton likes={article.likes} onToggle={togglePostLike} />
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
        <div className="aspect-[21/9] w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative">
          <Image
            src={article.post.coverImage ?? null}
            alt={article.post.title}
            width={1200}
            height={675}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ----- Content ----- */}
      <article className="max-w-3xl mx-auto px-4">
        <div
          className="prose prose-lg prose-slate max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-md
          prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: cleanHtmlContent }}
        />
      </article>

      <div className="max-w-3xl mx-auto px-4 mt-16">
        <hr className="border-gray-100" />
      </div>

      {/* ----- Comments Section ----- */}
      <section className="max-w-3xl mx-auto px-4 mt-12">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            {article.comments.length}
          </span>
        </div>
        <AddComment onAddComment={addComment} articleId={article.post.id} />
        <div className="space-y-8">
          {article.comments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <MessageCircleIcon />
              <p className="text-gray-500 mt-2">
                No comments yet. Start the conversation!
              </p>
            </div>
          ) : (
            <CommentList comments={article.comments} onRefresh={refetch} />
          )}
        </div>
      </section>

      {/* ----- Recommended Articles ----- */}
      <RecommendedArticles articles={article.recommended} />
    </main>
  );
}
