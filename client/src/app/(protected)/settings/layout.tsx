import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { SettingsSidebar } from "./_components/SettingsSidebar";

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
    <div className="mt-10 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb - will be customized by each page */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Settings
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-2">
              Manage your account settings and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 md:gap-8">
            <SettingsSidebar />
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
