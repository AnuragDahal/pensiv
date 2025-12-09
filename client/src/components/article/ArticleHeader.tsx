import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";

interface ArticleHeaderProps {
  title: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  date: string;
  estimatedReadTime: number;
  coverImage: string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title,
  category,
  author,
  date,
  estimatedReadTime,
  coverImage,
}) => (
  <header className="py-12 md:py-16 bg-gradient-to-b from-navy/5 to-transparent">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Badge className="mb-4 bg-accent text-white hover:bg-accent/90">
          {category}
        </Badge>
        <h1 className="mb-6 animate-fade-in">{title}</h1>
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{author.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-3">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {date}
              </span>
              <span className="hidden sm:flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {estimatedReadTime} min read
              </span>
            </div>
          </div>
        </div>
        <div className="relative aspect-[2/1] rounded-xl overflow-hidden mb-8">
          <Image
            src={coverImage}
            alt={title ?? "title"}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
        </div>
      </div>
    </div>
  </header>
);

export default ArticleHeader;
