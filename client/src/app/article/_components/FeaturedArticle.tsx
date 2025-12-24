import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FeaturedArticleProps {
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  date: string;
  estimatedReadTime: number;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  slug,
  title,
  shortDescription,
  coverImage,
  author,
  category,
  date,
  estimatedReadTime,
}) => {
  return (
    <Link href={`/article/${slug}`}>
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="w-full md:w-1/2 lg:w-3/5 relative">
              <div className="relative overflow-hidden rounded-2xl group aspect-[4/3] md:aspect-[16/9]">
                <Image
                  src={
                    coverImage ||
                    "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1074&auto=format&fit=crop"
                  }
                  alt={title ?? "cover"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  fill
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
                <div className="absolute left-6 bottom-6 right-6">
                  <Badge className="mb-3 bg-accent text-white hover:bg-accent/90">
                    {category}
                  </Badge>
                  <h2 className="text-white mb-2 drop-shadow-sm">{title}</h2>
                  <div className="flex items-center gap-3 text-white/90">
                    <Avatar className="h-8 w-8 border-2 border-white/20">
                      <AvatarImage src={author.avatar} alt={author.name} />
                      <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
                      <span className="font-medium">{author.name}</span>
                      <span className="hidden sm:inline-block">•</span>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {new Date(date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          · {estimatedReadTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-2/5 animate-fade-in">
              <div className="max-w-lg">
                <Badge
                  variant="outline"
                  className="mb-3 bg-accent text-white hover:bg-accent/90"
                >
                  Featured Article
                </Badge>
                <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                  {title}
                </h3>
                <p className="text-muted-foreground mb-6">{shortDescription}</p>
                <Link href={`/article/${slug}`}>
                  <Button variant="outline" className="group rounded-full">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedArticle;
