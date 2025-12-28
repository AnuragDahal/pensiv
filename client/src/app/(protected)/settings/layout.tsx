import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings page",
  keywords: ["settings", "user", "account"],
  robots: "index, follow",
  openGraph: {
    title: "Settings",
    description: "Settings page",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    title: "Settings",
    description: "Settings page",
    card: "summary_large_image",
  },
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="mt-10 pb-6">{children}</div>
      <Footer />
    </>
  );
};

export default layout;
