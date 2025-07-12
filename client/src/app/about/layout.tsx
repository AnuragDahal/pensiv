import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import React, { ReactNode } from "react";

export const metadata = {
  title: "About",
  description: "Learn more about Pensieve, your personal writing space.",
  keywords: ["about", "pensieve", "writing", "blog", "cms"],
  authors: [{ name: "Anurag Dahal" }],
  creator: "Anurag Dahal",
  publisher: "Anurag Dahal",
  category: "Blog",
  classification: "Blogging",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <Navbar />
      <body>{children}</body>
      <Footer />
    </html>
  );
};

export default Layout;
