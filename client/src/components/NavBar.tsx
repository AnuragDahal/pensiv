"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/article?q=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-background/80 backdrop-blur-lg shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Pensiv"
              width={50}
              height={50}
              className="rounded-sm"
            />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="link-underline font-medium">
              Home
            </Link>
            <Link href="/article" className="link-underline font-medium">
              Articles
            </Link>
            <Link href="/article/create" className="link-underline font-medium">
              Write
            </Link>
            <Link href="/about" className="link-underline font-medium">
              About
            </Link>
          </nav>{" "}
          <div className="hidden lg:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative group">
              <div
                className={`relative transition-all duration-300 ${
                  searchFocused ? "w-72" : "w-56"
                }`}
              >
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search articles..."
                  className="rounded-full pr-12 pl-5 h-11 bg-secondary/50 border-2 border-transparent hover:border-primary/20 focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 transition-all duration-300 placeholder:text-muted-foreground/60"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  aria-label="Search"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <Search className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </form>

            {!isLoggedIn && (
              <>
                <Link href="/login">
                  <Button variant="outline" className="rounded-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden h-screen absolute top-full left-0 right-0 bg-background shadow-md animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <form onSubmit={handleSearch} className="relative group mb-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-11 pr-4 h-12 bg-secondary/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
              />
            </form>

            <Link
              href="/"
              className="py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/article"
              className="py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Articles
            </Link>
            <Link
              href="/article/create"
              className="py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Write
            </Link>
            <Link
              href="/about"
              className="py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            {!isLoggedIn && (
              <>
                <Link
                  href="/signup"
                  className="py-2 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Signup
                </Link>
                <Link
                  href="/login"
                  className="py-2 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  LogIn
                </Link>
              </>
            )}
            {isLoggedIn && (
              <Link
                href="/api/auth/logout"
                className="py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Logout
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
