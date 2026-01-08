import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GlobalUserPanel } from "@/components/global-user-panel";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ChatDialog } from "@/components/chat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pensiv",
    template: "%s | Pensiv",
  },
  description:
    "Experience the joy of writing with Pensiv. A personal space for your thoughts, ideas, and stories.",
  keywords: [
    "writing",
    "blogging",
    "personal space",
    "thoughts",
    "ideas",
    "stories",
    "Pensiv",
  ],
  authors: [{ name: "Anurag Dahal" }],
  creator: "Anurag Dahal",
  publisher: "Anurag Dahal",
  category: "Blog",
  classification: "Blogging ",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pensiv.vercel.app",
    siteName: "Pensiv",
    title: "Pensiv - Your's Writing Space",
    description:
      "Experience the joy of writing with Pensiv. A personal space for your thoughts, ideas, and stories.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Pensiv - Your Writing Space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pensiv - Your's Writing Space",
    description:
      "Experience the joy of writing with Pensiv. A personal space for your thoughts, ideas, and stories.",
    images: ["/logo.png"],
    creator: "@pensiv",
    site: "@pensiv",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>
            <Toaster richColors />
            {children}
            <GlobalUserPanel />
            <ChatDialog />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
