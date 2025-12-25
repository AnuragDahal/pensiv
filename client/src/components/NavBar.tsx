"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
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
          <Link
            href="/"
            className="text-2xl font-serif font-bold text-navy transition-all duration-300 hover:opacity-80"
          >
            Pensieve
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
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles..."
                className="rounded-full hidden md:flex w-48"
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

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
              href="/create"
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
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
