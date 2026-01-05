"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Twitter, Mail, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SOCIAL_LINKS } from "@/lib/constants";
const Footer: React.FC = () => {
  const handleSubscribe = () => {
    toast.success(
      "Thank you for subscribing! The feature is not implemented yet."
    );
  };
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-serif font-bold text-navy">
              Pensiv
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              A modern publishing platform where readers find dynamic thinking,
              and where expert and undiscovered voices can share their writing.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-lavender/10 hover:text-navy"
                asChild
              >
                <a
                  href={SOCIAL_LINKS.TWITTER}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-lavender/10 hover:text-navy"
                asChild
              >
                <a
                  href={SOCIAL_LINKS.INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-lavender/10 hover:text-navy"
                asChild
              >
                <a
                  href={SOCIAL_LINKS.GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-lavender/10 hover:text-navy"
                asChild
              >
                <a href={SOCIAL_LINKS.MAIL} aria-label="Mail">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/article"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/article/create"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Write
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Subscribe</h3>
            <p className="text-muted-foreground mb-4">
              Get the latest articles and news delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input
                className="rounded-full"
                type="email"
                placeholder="Your email"
              />
              <Button onClick={handleSubscribe} className="rounded-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Pensiv. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
