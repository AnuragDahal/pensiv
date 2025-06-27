"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bookmark,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  Clock,
} from "lucide-react";
import ArticleCard from "@/app/article/_components/ArticleCard";
import { CommentsForm } from "../_components/forms/comments-form";
import CommentCard from "../_components/comment-card";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import Image from "next/image";

// Mock data for article
// export const article = {
//   id: "1",
//   title: "The Future of Web Design: Minimalism Meets Functionality",
//   content: `
//     <p class="text-lg leading-relaxed mb-6">
//       In the ever-evolving landscape of web design, minimalism has emerged as more than just an aesthetic choice—it's become a fundamental approach to creating functional, user-centered digital experiences. This shift represents a maturation of the web as a medium, where designers are increasingly focused on removing unnecessary elements rather than adding more features.
//     </p>

//     <h2 class="text-2xl font-semibold my-6">The Evolution of Minimalist Web Design</h2>

//     <p class="leading-relaxed mb-6">
//       Minimalism in web design isn't new, but its application has evolved significantly. Early minimalist websites often sacrificed functionality in pursuit of visual simplicity. Today's approach balances aesthetic restraint with robust functionality, creating experiences that are both beautiful and highly usable.
//     </p>

//     <p class="leading-relaxed mb-6">
//       Modern minimalist design is characterized by:
//     </p>

//     <ul class="list-disc pl-6 mb-6 space-y-2">
//       <li>Purposeful white space that guides attention</li>
//       <li>Limited color palettes that enhance brand recognition</li>
//       <li>Typography as a central design element</li>
//       <li>Intuitive navigation patterns</li>
//       <li>Strategic use of subtle animations and transitions</li>
//     </ul>

//     <p class="leading-relaxed mb-6">
//       These elements combine to create interfaces that feel clean and uncluttered, but still provide rich functionality and clear pathways for users.
//     </p>

//     <h2 class="text-2xl font-semibold my-6">User Experience and Cognitive Load</h2>

//     <p class="leading-relaxed mb-6">
//       The primary advantage of minimalist design is the reduction of cognitive load—the mental effort required to use a website. By carefully curating what appears on screen, designers help users focus on completing their goals without distraction or confusion.
//     </p>

//     <p class="leading-relaxed mb-6">
//       Research has consistently shown that simplified interfaces lead to higher conversion rates, longer time on site, and greater user satisfaction. Users appreciate experiences that respect their attention and make navigation intuitive.
//     </p>

//     <h2 class="text-2xl font-semibold my-6">Performance Benefits</h2>

//     <p class="leading-relaxed mb-6">
//       Beyond aesthetics and usability, minimalist design offers significant performance advantages. Simpler pages load faster, consume less bandwidth, and often require less maintenance over time. This performance boost is particularly important in mobile contexts, where connection speeds may vary and users have little patience for slow-loading content.
//     </p>

//     <h2 class="text-2xl font-semibold my-6">The Future Direction</h2>

//     <p class="leading-relaxed mb-6">
//       Looking ahead, we can expect minimalist design principles to become even more important as digital experiences expand to new contexts. As interfaces spread across wearables, smart home devices, and augmented reality, clarity and simplicity will be essential.
//     </p>

//     <p class="leading-relaxed mb-6">
//       However, this doesn't mean tomorrow's websites will be visually bland. The next evolution will likely incorporate more sophisticated animations, thoughtful microinteractions, and personalized experiences—all while maintaining the core principles of minimalist design.
//     </p>

//     <h2 class="text-2xl font-semibold my-6">Conclusion</h2>

//     <p class="leading-relaxed mb-6">
//       The future of web design lies in the thoughtful application of minimalist principles to create experiences that feel personal, engaging, and effortless. By focusing on what truly matters to users and elegantly removing everything else, designers can create digital products that stand the test of time.
//     </p>
//   `,
//   coverImage:
//     "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1074&auto=format&fit=crop",
//   author: {
//     name: "Alex Morgan",
//     avatar:
//       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww",
//     bio: "Designer and writer focused on the intersection of aesthetics and functionality. Former design lead at Abstract Studios.",
//   },
//   category: "Design",
//   date: "May 20, 2023",
//   estimatedReadTime: 8,
//   tags: ["Web Design", "UX", "Minimalism", "Design Trends"],
// };

interface Comment {
  id: string;
  userId: {
    name: string;
    email: string;
    avatar?: string;
  };
  postId: string;
  content: string;
  date: string;
  likes?: number;
}

interface Article {
  id: string;
  userId: {
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  title: string;
  excerpt?: string;
  coverImage: string;
  comments: Comment[];
  category: string;
  content: string; // HTML content or Markdown
  tags?: string[];
  date: string;
  estimatedReadTime: number;
  featured?: boolean;
}

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
  const [article, setArticle] = useState<Article>({
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
        id: "",
        userId: {
          name: "",
          email: "",
          avatar: "",
        },
        postId: "",
        content: "",
        date: "",
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
  useEffect(() => {
    // Fetch article data from the server
    const fetchArticle = async () => {
      try {
        console.log("Fetching article with ID:", id);
        console.log("Access Token:", accessToken);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
          {
            withCredentials: true, // Include cookies for authentication
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Assuming the response data structure matches the article object
        setArticle(response.data.data);
        toast.success(response.data.message || "Article fetched successfully");
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id, accessToken]);

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
                  src={article.coverImage??"https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1074&auto=format&fit=crop"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  width={1920}
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
              <div className="mt-8 flex flex-col sm:flex-row gap-4 p-6 rounded-xl bg-muted/30 border border-border/50">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={article.userId.avatar}
                    alt={article.userId.name}
                  />
                  <AvatarFallback>
                    {article.userId.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{article.userId.name}</h3>
                  <p className="text-muted-foreground mt-1">
                    {article.userId.bio ?? ""}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 rounded-full text-xs"
                  >
                    Follow
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <h3 className="font-serif font-semibold text-2xl mb-6">
                  Comments ({article.comments.length})
                </h3>

                {/* Comment Form */}
                <CommentsForm postId={article.id} />

                {/* Comments List */}
                <div className="space-y-6">
                  {article.comments.map((comment, index) => (
                    <div key={comment.id} className="animate-fade-in">
                      <CommentCard
                        name={comment.userId.name}
                        avatar={comment.userId.avatar}
                        date={comment.date}
                        content={comment.content}
                        likes={comment.likes || 0}
                      />
                      {index !== article.comments.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </div>
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
