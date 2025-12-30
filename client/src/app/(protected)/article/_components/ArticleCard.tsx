import type React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star } from "lucide-react";
import Image from "next/image";
import Profile from "@/components/profile";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  date: string;
  estimatedReadTime: number;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  excerpt,
  slug,
  coverImage,
  author,
  category,
  date,
  estimatedReadTime,
  featured = false,
}) => {
  return (
    <Link href={`/article/${slug}`} className="group block h-full">
      <article
        className={`overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg h-full flex flex-col ${
          featured
            ? "border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5"
            : "border-border bg-card hover:border-primary/30"
        }`}
      >
        {/* Cover Image - 3:2 Aspect Ratio */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={coverImage || "/placeholder.svg"}
            title={title}
            alt={title ?? "Article cover"}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={featured}
          />

          {/* Badges Overlay */}
          <div className="absolute top-2 md:top-3 left-2 md:left-3 right-2 md:right-3 flex items-start justify-between gap-2">
            <Badge className="bg-accent text-white hover:bg-accent/90 text-xs">
              {category}
            </Badge>
            {featured && (
              <Badge className="bg-amber-500 text-white hover:bg-amber-600 shadow-md text-xs">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col p-4 md:p-5 flex-1">
          {/* Title */}
          <h3 className="text-base md:text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2 leading-relaxed flex-1">
            {excerpt}
          </p>

          {/* Author & Date */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/50 mt-auto">
            <div className="flex items-center gap-2 min-w-0">
              <Profile name={author?.name} avatar={author?.avatar} size="sm" />
              <span className="text-xs md:text-sm font-medium truncate">
                {author?.name || "Anonymous"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
