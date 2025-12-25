import type React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star } from "lucide-react";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
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
  featured=false,
}) => {
  return (
    <Link href={`/article/${slug}`} className="group block">
      <article
        className={`overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg ${
          featured
            ? "border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5"
            : "border-border bg-card hover:border-primary/30"
        }`}
      >
        {/* Mobile/Tablet: Vertical Layout */}
        <div className="flex flex-col md:hidden">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={coverImage || "/placeholder.svg"}
              title={title}
              alt={title ?? "Article cover"}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              fill
              sizes="100vw"
              priority={featured}
            />

            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
              <Badge className="mb-3 bg-accent text-white hover:bg-accent/90">
                {category}
              </Badge>
              {featured && (
                <Badge className="bg-amber-500 text-white hover:bg-amber-600 shadow-md">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col p-5">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>

            <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Profile name={author.name} avatar={author.avatar} />
                  <span className="text-sm font-medium truncate">
                    {author.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    // <span>{estimatedReadTime} min</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet/Desktop: Horizontal Layout */}
        <div className="hidden md:grid md:grid-cols-[320px_1fr] gap-0">
          <div className="relative overflow-hidden">
            <Image
              src={coverImage}
              title={title}
              alt={title ?? "Article cover"}
              className="object-cover transition-transform duration-500 group-hover:scale-105 h-full"
              fill
              sizes="320px"
              priority={featured}
            />

            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
              <Badge className="bg-accent text-white hover:bg-accent/90">
                {category}
              </Badge>
              {featured && (
                <Badge className="bg-amber-500 text-white hover:bg-amber-600 shadow-md">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col p-7">
            <h3 className="text-2xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            <p className="text-base text-muted-foreground mb-5 line-clamp-3 leading-relaxed flex-1">
              {excerpt}
            </p>

            <div className="flex items-center justify-between gap-4 pt-4 mt-auto border-t border-border/50">
              <div className="flex items-center gap-3">
                <Profile name={author.name} avatar={author.avatar} />
                <span className="text-sm font-medium">{author.name}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{estimatedReadTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
