/**
 * Chat-related types
 */

export interface RelatedArticle {
  title: string;
  slug: string;
  url: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  relatedArticles?: RelatedArticle[];
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  relatedArticles: RelatedArticle[];
}

export interface ChatApiResponse {
  status: string;
  statusCode: number;
  message: string;
  data: ChatResponse;
}
