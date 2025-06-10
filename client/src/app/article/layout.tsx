import { ProtectedRoute } from "@/components/auth/protected-route";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import React, { ReactNode } from "react";

interface ArticleLayoutProps {
  children: ReactNode;
}

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
