"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const BlogGrid = () => {
  const router = useRouter();
  const randomId = Math.floor(Math.random() * 100000) + 1;
  const handleRedirect = () => {
    // Redirect to the blog page
    router.push(`/blog/${randomId}`);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-8 text-4xl font-bold text-center">Latest Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-shadow"
            onClick={handleRedirect}
          >
            <CardHeader className="p-0">
              <div className="relative h-48">
                <Image
                  src="/image-generator-freepik-7.jpeg"
                  alt="blog"
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2">
                How to Master Web Design
              </CardTitle>
              <CardDescription className="line-clamp-2">
                Learn the essential principles and modern techniques for
                creating stunning websites that engage users and drive results.
              </CardDescription>
            </CardContent>
            <CardFooter className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">John Doe</span>
                </div>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Aug 12</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>4 min read</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogGrid;
