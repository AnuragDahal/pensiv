// src/app/article/[id]/page.tsx
"use client";
import { useArticle } from "@/hooks/useArticle";
import { ArticleResponse, Comment } from "@/types/article";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

/* ---------- Icons ---------- */
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${
      filled ? "fill-red-500 text-red-500" : "text-gray-600"
    }`}
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    fill="none"
  >
    <path d="M12 21C12 21 5 13.5 5 8.5C5 5.42 7.42 3 10.5 3C12.24 3 13.91 3.81 15 5.09C16.09 3.81 17.76 3 19.5 3C22.58 3 25 5.42 25 8.5C25 13.5 18 21 18 21H12Z" />
  </svg>
);

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-600"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    fill="none"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M8.7 10.7l6.6 -3.4" />
    <path d="M8.7 13.3l6.6 3.4" />
  </svg>
);

const MessageCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-600"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    fill="none"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
  </svg>
);

/* ---------- Helper components ---------- */

function LikeButton({
  likes,
  onToggle,
}: {
  likes: { count: number; isLikedByUser: boolean };
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors group"
    >
      <HeartIcon filled={likes.isLikedByUser} />
      <span
        className={`text-sm font-medium ${
          likes.isLikedByUser
            ? "text-red-600"
            : "text-gray-600 group-hover:text-red-500"
        }`}
      >
        {likes.count}
      </span>
    </button>
  );
}

function ShareButton({ title, text }: { title: string; text: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
    >
      <ShareIcon />
      <span className="text-sm font-medium">Share</span>
    </button>
  );
}

/** Recursive comment tree – renders a comment and its replies */
function CommentNode({ comment }: { comment: Comment }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await axios.post(`/api/comments/reply/${comment.id}`, {
        content: replyText,
      });
      setReplyText("");
      setShowReplyBox(false);
      toast.success("Reply posted!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to post reply");
    }
  };

  return (
    <div className="group">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Image
            src={comment.author.avatar}
            alt={comment.author.name}
            width={40}
            height={40}
            className="rounded-full object-cover border border-gray-100"
          />
        </div>
        <div className="flex-grow">
          <div className="bg-gray-50 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900">
                {comment.author.name}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-1 ml-2">
            <LikeButton
              likes={comment.likes}
              onToggle={async () => {
                const endpoint = comment.likes.isLikedByUser
                  ? `/api/comments/${comment.id}/unlike`
                  : `/api/comments/${comment.id}/like`;
                await axios.post(endpoint);
              }}
            />
            <button
              onClick={() => setShowReplyBox(!showReplyBox)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800"
            >
              Reply
            </button>
          </div>

          {/* Reply input */}
          {showReplyBox && (
            <div className="mt-3 flex gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex-grow">
                <textarea
                  rows={2}
                  placeholder="Write a reply..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 resize-none bg-white"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowReplyBox(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReply}
                    className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Render nested replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <Image
                    src={reply.author.avatar}
                    alt={reply.author.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover border border-gray-100 w-8 h-8"
                  />
                  <div>
                    <div className="bg-gray-50 rounded-2xl px-4 py-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm text-gray-900">
                          {reply.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Main page component ---------- */

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error, refetch } = useArticle(slug!);

  // Toggle like for the main post
  const togglePostLike = async () => {
    if (!data) return;
    const endpoint = data.likes.isLikedByUser
      ? `/api/posts/${data.post.id}/unlike`
      : `/api/posts/${data.post.id}/like`;
    await axios.post(endpoint);
    refetch(); // refresh counts
  };

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

  const article = data as ArticleResponse;

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
                src={article.post.author.avatar}
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
          {/* {/* Add a skeleton loader */}
          {/* {loading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <Image
              src={article.post.coverImage}
              alt={article.post.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
            />
          )} */}
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

        <div className="space-y-8">
          {article.comments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <MessageCircleIcon />
              <p className="text-gray-500 mt-2">
                No comments yet. Start the conversation!
              </p>
            </div>
          ) : (
            article.comments.map((c) => <CommentNode key={c.id} comment={c} />)
          )}
        </div>
      </section>

      {/* ----- Recommended Articles ----- */}
      <section className="max-w-7xl mx-auto px-4 mt-20 bg-gray-50 py-16 rounded-3xl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Recommended for you
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {article.recommended.map((rec) => (
              <Link
                key={rec.id}
                href={`/article/${rec.id}`}
                className="block group"
              >
                <article className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Image
                      src={rec.author.avatar}
                      alt={rec.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-600">
                      {rec.author.name}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {rec.title}
                  </h3>
                  <div className="mt-auto pt-4 flex flex-wrap gap-2">
                    {rec.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
