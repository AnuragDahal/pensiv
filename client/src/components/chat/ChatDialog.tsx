"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Trash2, Sparkles } from "lucide-react";
import { useChat } from "@/lib/hooks";
import { CHAT_CONFIG } from "@/lib/constants";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { cn } from "@/lib/utils";

export function ChatDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(true);
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Hide welcome bubble after configured timeout or when chat is opened
  useEffect(() => {
    const timer = setTimeout(
      () => setShowWelcomeBubble(false),
      CHAT_CONFIG.WELCOME_BUBBLE_TIMEOUT
    );
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowWelcomeBubble(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Welcome Bubble */}
      {showWelcomeBubble && !isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 max-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-300 cursor-pointer"
          onClick={handleOpen}
        >
          <div className="bg-background border rounded-2xl rounded-br-sm px-4 py-3 shadow-lg">
            <p className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-coral" />
              {CHAT_CONFIG.WELCOME_BUBBLE_TEXT}
            </p>
          </div>
        </div>
      )}

      {/* Chat Trigger Button */}
      <Button
        size="icon"
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full bg-coral hover:bg-coral/90 shadow-lg z-50 transition-transform",
          isOpen && "scale-0"
        )}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat assistant</span>
      </Button>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] transition-all duration-300 ease-out",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex h-[500px] max-h-[70vh] flex-col rounded-2xl border bg-background shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coral">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Pensiv Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1">
            <div ref={scrollRef} className="flex flex-col">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onLinkClick={handleLinkClick}
                />
              ))}

              {isLoading && (
                <div className="flex gap-3 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggestions */}
          {messages.length <= 1 && !isLoading && (
            <div className="border-t px-4 py-3 bg-muted/20">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {CHAT_CONFIG.SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full border bg-background hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          onClick={handleClose}
        />
      )}
    </>
  );
}
