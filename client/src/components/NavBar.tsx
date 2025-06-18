"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
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
            <Link href="/articles" className="link-underline font-medium">
              Articles
            </Link>
            <Link href="/create" className="link-underline font-medium">
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

            {isLoggedIn ? (
              <div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user?.avatar ||
                        "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
                      }
                      alt={user?.name || user?.email || "User Avatar"}
                    />
                    <AvatarFallback>
                      {user?.name?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {user?.name || user?.email || "User"}
                  </span>
                </div>
              </div>
            ) : (
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-background shadow-md animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link
              href="/"
              className="py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/articles"
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
            </Link>{" "}
            <div className="flex flex-col space-y-2 pt-2 pb-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-2 px-2 py-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.name || user?.email}
                      />
                      <AvatarFallback className="text-xs">
                        {user?.name?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
