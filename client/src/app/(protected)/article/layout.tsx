import { ReactNode } from "react";
import { Metadata } from "next";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </div>
      <Footer />
    </>
  );
}
