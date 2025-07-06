// components/NotFoundPage.tsx
"use client";

import React from "react";

interface NotFoundPageProps {
  content?: string;
  children?: React.ReactNode;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({
  content = "Not Found",
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{content}</h2>
      {children}
    </div>
  );
};

export default NotFoundPage;
