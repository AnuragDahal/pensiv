import Footer from "@/components/Footer";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      {children}
      <Footer />
    </div>
  );
};

export default layout;
