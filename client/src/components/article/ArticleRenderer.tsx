"use client";
import { useEffect, useRef } from "react";
import hljs from "@/components/ui/higlightSetup";
import Copy from "./copy";
import { createRoot, Root } from "react-dom/client";

interface ArticleRendererProps {
  content: string;
}

const ArticleRenderer = ({ content }: ArticleRendererProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Apply syntax highlighting
    const codeBlocks = contentRef.current.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      if (block.getAttribute("data-highlighted") === "yes") return;
      hljs.highlightElement(block as HTMLElement);
      block.setAttribute("data-highlighted", "yes");
    });

    // Add Copy buttons
    const preBlocks = contentRef.current.querySelectorAll("pre");
    // Store cleanup functions for each block
    const cleanups: (() => void)[] = [];

    preBlocks.forEach((pre) => {
      // 1. Clean up any existing copy button from a previous render mechanism to avoid duplicates/zombie nodes
      const existingContainer = pre.querySelector(".copy-btn-container");
      if (existingContainer) {
        existingContainer.remove();
      }

      // Add relative positioning
      pre.classList.add("relative", "group");

      // Extract text
      const codeBlock = pre.querySelector("code");
      if (!codeBlock) return;
      const codeText = codeBlock.textContent || "";

      // 2. Create and append new container
      const buttonContainer = document.createElement("div");
      // Re-added group-hover and opacity transition for better UI now that logic is fixed
      buttonContainer.className =
        "copy-btn-container absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"; 
      pre.appendChild(buttonContainer);

      // 3. Mount React component
      const root = createRoot(buttonContainer);
      root.render(<Copy content={codeText} />);

      // 4. Register cleanup
      cleanups.push(() => {
        // Use setImmediate/setTimeout(0) approach or direct unmount
        // Safest in strict mode is to unmount and remove node.
        setTimeout(() => {
          root.unmount();
          if (pre.contains(buttonContainer)) {
            pre.removeChild(buttonContainer);
          }
        }, 0);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [content]);

  return (
    <article
      className="max-w-3xl mx-auto px-5 w-full prose prose-lg 
      prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-black
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
      prose-img:rounded-2xl prose-img:shadow-md prose-img:my-10 prose-img:w-full
      prose-p:leading-8 prose-p:text-black
      prose-li:text-black
      prose-strong:text-black
      prose-pre:bg-gray-900 prose-pre:shadow-lg prose-pre:overflow-x-auto prose-pre:rounded-xl
      break-words"
    >
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};

export default ArticleRenderer;
