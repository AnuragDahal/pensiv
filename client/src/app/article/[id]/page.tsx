"use client";
import ArticleCard from "@/app/article/_components/ArticleCard";
import AuthorBio from "@/components/article/AuthorBio";
import CommentList from "@/components/comments/CommentList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useArticle } from "@/hooks/useArticle";
import { useAuthStore } from "@/store/auth-store";
import { ArticleProps } from "@/types/article";
import { Comment } from "@/types/comments";
import axios from "axios";
import {
  Bookmark,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Backend comment interface
interface BackendComment {
  id?: string;
  _id?: string;
  postId: string;
  userId?: {
    name?: string;
    avatar?: string;
  };
  date?: string;
  createdAt?: string;
  content: string;
  likes?: number;
  replies?: BackendReply[];
}

interface BackendReply {
  id?: string;
  _id?: string;
  userId?: {
    name?: string;
    avatar?: string;
  };
  date?: string;
  createdAt?: string;
  content: string;
}

// Transform backend comment data to frontend format
const transformComment = (backendComment: BackendComment): Comment => {
  return {
    id: backendComment.id || backendComment._id || '',
    postId: backendComment.postId,
    name: backendComment.userId?.name || "Anonymous",
    avatar: backendComment.userId?.avatar,
    date: new Date(backendComment.date || backendComment.createdAt || Date.now()).toLocaleDateString(),
    content: backendComment.content,
    likes: backendComment.likes || 0,
    replies: backendComment.replies?.map((reply: BackendReply) => ({
      id: reply.id || reply._id || '',
      postId: backendComment.postId,
      name: reply.userId?.name || "Anonymous",
      avatar: reply.userId?.avatar,
      date: new Date(reply.date || reply.createdAt || Date.now()).toLocaleDateString(),
      content: reply.content,
      likes: 0, // Replies don't have likes in the current backend model
      replies: [], // Nested replies not supported yet
    })) || [],
  };
};
import { CommentsForm } from "../_components/forms/comments-form";

// Mock data for related articles
const relatedArticles = [
  {
    id: "7",
    title: "Color Theory for Digital Designers: A Practical Guide",
    excerpt:
      "Master the essentials of color theory to create more harmonious and effective designs for digital platforms.",
    coverImage:
      "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1035&auto=format&fit=crop",
    author: {
      name: "Chris Wilson",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop&q=60",
    },
    category: "Design",
    date: "May 5, 2023",
    estimatedReadTime: 7,
  },
  {
    id: "8",
    title: "The Psychology Behind Effective UI Design",
    excerpt:
      "Understanding how humans perceive and interact with interfaces can dramatically improve your design decisions.",
    coverImage:
      "https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=1470&auto=format&fit=crop",
    author: {
      name: "Eliza Chen",
      avatar:
        "https://images.unsplash.com/photo-1614644147724-2d4785d69962?w=100&auto=format&fit=crop&q=60",
    },
    category: "Design",
    date: "April 28, 2023",
    estimatedReadTime: 9,
  },
  {
    id: "9",
    title: "Responsive Design in 2023: Beyond Media Queries",
    excerpt:
      "Modern approaches to creating truly adaptive experiences that work across the entire device spectrum.",
    coverImage:
      "https://images.unsplash.com/photo-1547119957-637f8679db1e?q=80&w=1364&auto=format&fit=crop",
    author: {
      name: "Thomas Bennett",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=60",
    },
    category: "Development",
    date: "April 22, 2023",
    estimatedReadTime: 6,
  },
];

const Article = () => {
  const { id } = useParams();
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();
  const [article, setArticle] = useState<ArticleProps>({
    id: "",
    title: "",
    excerpt: "",
    coverImage: "",
    userId: {
      name: "",
      email: "",
      avatar: "",
      bio: "",
    },
    comments: [
      {
        id: "1",
        name: "Jane Doe",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        postId: "post1",
        content: "This is a top-level comment!",
        date: "2025-07-02",
        likes: 2,
        replies: [
          {
            id: "2",
            name: "John Smith",
            avatar: "https://randomuser.me/api/portraits",
            date: "2025-07-02",
            content: "This is a reply to the top-level comment.",
            likes: 4,
            postId: "post1",
            replies: [],
          },
        ],
      },
    ],
    category: "",
    content: "",
    tags: [],
    date: "",
    estimatedReadTime: 0,
    featured: false,
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const { articleData } = useArticle(id as string);

  useEffect(() => {
    if (articleData) {
      setArticle(articleData);
    }
  }, [articleData]);

  // Add a function to refresh the article (comments)
  const refreshArticle = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Transform the backend data to match frontend types
      const backendData = response.data.data;
      const transformedData: ArticleProps = {
        ...backendData,
        excerpt: backendData.shortDescription,
        date: new Date(backendData.createdAt).toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        estimatedReadTime: Math.ceil(backendData.content.split(" ").length / 200),
        comments: backendData.comments?.map(transformComment) || [],
      };

      setArticle(transformedData);
    } catch (error) {
      console.error("Error refreshing article:", error);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-20">
        {/* Article Header */}
        <header className="py-12 md:py-16 bg-gradient-to-b from-navy/5 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4 bg-accent text-white hover:bg-accent/90">
                {article.category}
              </Badge>

              <h1 className="mb-6 animate-fade-in">{article.title}</h1>

              <div className="flex items-center gap-4 mb-8">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={article.userId.avatar}
                    alt={article.userId.name}
                  />
                  <AvatarFallback>
                    {article.userId.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="font-medium">{article.userId.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {article.date}
                    </span>
                    <span className="hidden sm:flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.estimatedReadTime} min read
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[2/1] rounded-xl overflow-hidden mb-8">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  width={1200}
                  height={1080}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              {/* Social Sharing Sidebar */}
              <div className="hidden lg:block fixed left-8 top-1/3 space-y-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full transition-all ${
                    isLiked ? "text-red-500 bg-red-50" : ""
                  }`}
                  onClick={handleLike}
                >
                  <Heart
                    className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`}
                  />
                  <span className="sr-only">Like</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Comment</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full transition-all ${
                    isBookmarked ? "text-navy bg-lavender/10" : ""
                  }`}
                  onClick={handleBookmark}
                >
                  <Bookmark
                    className={`h-5 w-5 ${isBookmarked ? "fill-navy" : ""}`}
                  />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </div>

              {/* Article Text */}
              <article className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </article>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full bg-muted/50 hover:bg-muted"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Mobile Action Bar */}
              <div className="lg:hidden mt-8 flex justify-between items-center border-t border-b border-border py-4">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full ${isLiked ? "text-red-500" : ""}`}
                    onClick={handleLike}
                  >
                    <Heart
                      className={`h-4 w-4 mr-1 ${
                        isLiked ? "fill-red-500" : ""
                      }`}
                    />
                    {likeCount}
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {article.comments.length}
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full ${
                      isBookmarked ? "text-navy" : ""
                    }`}
                    onClick={handleBookmark}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${isBookmarked ? "fill-navy" : ""}`}
                    />
                  </Button>
                </div>
              </div>
              {/* Author Bio */}
              <AuthorBio
                name={article.userId.name}
                avatar={article.userId.avatar}
                bio={article.userId.bio}
              />

              {/* Comments Section */}
              <div className="mt-12">
                <h3 className="font-serif font-semibold text-2xl mb-6">
                  Comments ({article.comments.length})
                </h3>

                {/* Comment Form */}
                <CommentsForm
                  avatar={article.userId.avatar}
                  name={article.userId.name}
                  postId={article.id}
                  onCommentAdded={refreshArticle}
                />

                {/* Comments List */}
                <CommentList comments={article.comments} onReplyAdded={refreshArticle} />
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ArticleCard {...article} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Article;
