"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import Link from "next/link";
import type { ChatMessage as ChatMessageType } from "@/lib/hooks/use-chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-coral" : "bg-navy"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3",
          isUser
            ? "bg-coral text-white rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>

        {message.relatedArticles && message.relatedArticles.length > 0 && (
          <div className="mt-2 border-t border-border/50 pt-2">
            <p className="text-xs font-medium mb-2 opacity-80">
              Related Articles:
            </p>
            <div className="flex flex-col gap-1">
              {message.relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={article.url || `/article/${article.slug}`}
                  className={cn(
                    "text-xs underline-offset-2 hover:underline",
                    isUser ? "text-white/90" : "text-teal"
                  )}
                >
                  {article.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
