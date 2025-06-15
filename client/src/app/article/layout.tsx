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
      <Navbar />
      <div className="mt-10 pb-6">{children}</div>
      <Footer />
    </ProtectedRoute>
  );
}
