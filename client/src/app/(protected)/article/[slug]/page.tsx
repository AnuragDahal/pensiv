import type { Metadata, ResolvingMetadata } from "next";
import ArticleClientPage from "./article-client-page";
import { ArticleResponse } from "@/types/article";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Function to fetch article data
async function getArticleData(slug: string): Promise<ArticleResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${slug}`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch article for metadata:", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticleData(slug);
  const previousImages = (await parent).openGraph?.images || [];

  if (!data?.post) {
    return {
      title: "Article Not Found | Pensiv",
      description: "The article you are looking for does not exist.",
    };
  }

  const { post } = data;
  const description = post.content
    ? post.content.substring(0, 150).replace(/[#*`]/g, "").trim() + "..."
    : "Read this article on Pensiv";

  return {
    title: `${post.title} | Pensiv`,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      url: `https://pensiv.vercel.app/article/${slug}`, // Ideally use env var for base URL
      siteName: "Pensiv",
      images: [
        {
          url: post.coverImage || "/logo.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
        ...previousImages,
      ],
      type: "article",
      authors: [post.author?.name || "Pensiv User"],
      publishedTime: post.createdAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [post.coverImage || "/logo.png"],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  return <ArticleClientPage slug={slug} />;
}
