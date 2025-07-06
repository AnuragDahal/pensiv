import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Image from "next/image";

interface ArticleCardProps {
  id: string;
  title: string;
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
  id,
  title,
  excerpt,
  coverImage,
  author,
  category,
  date,
  estimatedReadTime,
  featured = false,
}) => {
  console.log("Cover Image:", coverImage);
  return (
    <Link href={`/article/${id}`} className="block group">
      <article
        className={`overflow-hidden rounded-2xl h-full card-hover ${
          featured ? "bg-gradient-to-br from-navy/5 to-lavender/5" : "bg-card"
        }`}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={coverImage}
            title={title}
            aria-label="Article Cover Image"
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="100vw"
            priority={featured}
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-accent text-white hover:bg-accent/90">
              {category}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-accent transition-colors">
            {title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-2">{excerpt}</p>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{author.name}</span>
            </div>

            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {date} · {estimatedReadTime} min read
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
