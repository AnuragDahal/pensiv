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
      <body>{children}</body>
    </html>
  );
};

export default Layout;
