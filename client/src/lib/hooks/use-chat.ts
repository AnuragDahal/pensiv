import { useState, useCallback } from "react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  relatedArticles?: {
    title: string;
    slug: string;
    description: string;
  }[];
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  relatedArticles: {
    title: string;
    slug: string;
    description: string;
  }[];
}

interface ApiResponse {
  status: string;
  statusCode: number;
  message: string;
  data: ChatResponse;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your Pensiv assistant. I can help you find articles, answer questions about blog content, and provide summaries. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS.CHAT.SEND,
        { query }
      );

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.data.data.response,
        relatedArticles: response.data.data.relatedArticles,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get response";
      setError(errorMessage);

      const errorResponse: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your Pensiv assistant. I can help you find articles, answer questions about blog content, and provide summaries. What would you like to know?",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
