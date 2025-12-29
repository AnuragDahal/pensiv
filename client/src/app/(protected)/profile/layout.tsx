import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile page",
  keywords: ["profile", "user", "account"],
  robots: "index, follow",
  openGraph: {
    title: "Profile",
    description: "Profile page",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    title: "Profile",
    description: "Profile page",
    card: "summary_large_image",
  },
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-10 pb-6">{children}</div>;
};

export default layout;
