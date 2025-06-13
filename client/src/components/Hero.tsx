import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const Hero: React.FC = () => {
  const { isLoggedIn } = useAuth();
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-lavender/10 via-cream to-teal/10 opacity-50" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-lavender/10 text-navy font-medium text-sm mb-6 animate-fade-in">
            A modern publishing platform
          </span>

          <h1 className="mb-6 animate-fade-in-slow">
            <span className="text-gradient">Ideas that inspire,</span>
            <br />
            stories that resonate.
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-slow"
            style={{ animationDelay: "100ms" }}
          >
            Pensieve is a modern publishing platform where readers find dynamic
            thinking, and where expert and undiscovered voices can share their
            writing.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-slow"
            style={{ animationDelay: "200ms" }}
          >
            <Link href="/article">
              <Button className="rounded-full text-base px-6 py-6" size="lg">
                Start Reading
              </Button>
            </Link>
            {isLoggedIn ? (
              <Link href="/article/create">
                <Button
                  variant="outline"
                  className="rounded-full text-base px-6 py-6 group"
                  size="lg"
                >
                  Start Writing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-full text-base px-6 py-6 group"
                  size="lg"
                >
                  Start Writing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
