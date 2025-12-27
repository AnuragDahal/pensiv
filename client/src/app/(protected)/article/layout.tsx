import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import React, { ReactNode } from "react";
import { Metadata } from "next";

interface ArticleLayoutProps {
  children: ReactNode;
}
export const metadata: Metadata = {
  title: "Articles",
  description: "Explore our latest articles on various topics.",
  keywords: ["articles", "blog", "writing", "content"],
};
export default function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="mt-10 pb-6">{children}</div>
      <Footer />
    </>
  );
}
