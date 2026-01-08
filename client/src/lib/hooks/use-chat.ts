import { useState, useCallback } from "react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS, CHAT_CONFIG } from "@/lib/constants";
import type { ChatMessage, ChatApiResponse } from "@/types/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: CHAT_CONFIG.WELCOME_MESSAGE,
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
      const response = await apiClient.post<ChatApiResponse>(
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
        content: CHAT_CONFIG.WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  // Count user messages (for guest limit)
  const userMessageCount = messages.filter((m) => m.role === "user").length;

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    userMessageCount,
  };
}
