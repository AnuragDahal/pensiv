"use client";

import dynamic from "next/dynamic";

const ChatDialog = dynamic(
  () => import("./ChatDialog").then((mod) => mod.ChatDialog),
  {
    ssr: false,
  }
);

export function ChatWrapper() {
  return <ChatDialog />;
}
