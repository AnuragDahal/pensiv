import React, { useEffect, useState } from "react";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import parse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import { unified } from "unified";
import hljs from "highlight.js";
import Copy from "@/components/article/copy";
import { createRoot } from "react-dom/client";

type Props = {
  md: string;
};

const MdRender: React.FC<Props> = ({ md }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const renderMarkdown = async () => {
      const content = await unified()
        .use(parse)
        .use(remarkToc, { heading: "Table of Contents", tight: true })
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeStringify)
        .process(md);

      setHtmlContent(content.toString());
    };

    renderMarkdown();
  }, [md]);

  useEffect(() => {
    // Add copy buttons to code blocks
    document.querySelectorAll("pre").forEach((block) => {
      // Create wrapper for positioning
      const wrapper = document.createElement("div");
      wrapper.className = "relative group";
      block.parentNode?.insertBefore(wrapper, block);
      wrapper.appendChild(block);

      // Create copy button container
      const copyContainer = document.createElement("div");
      copyContainer.className =
        "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity";
      wrapper.appendChild(copyContainer);

      // Render Copy component
      const root = createRoot(copyContainer);
      root.render(<Copy content={block.textContent || ""} />);

      // Apply syntax highlighting
      hljs.highlightElement(block);
    });
  }, [htmlContent]);

  return (
    <>
      <div
        className="prose prose-lg prose-img:size-[400px] prose-img:rounded-md text-primary/70 font-blogBody prose-a:text-primary dark:prose-ol:text-white
                dark:prose-ul:text-white
                prose-ul:text-primary
                 prose-blockquote:text-primary 
                prose-blockquote:font-blogBody 
                prose-blockquote:leading-8
                prose-blockquote:border-l-4
                prose-blockquote:border-primary
                prose-blockquote:pl-4
                prose-blockquote:italic
                 prose-p:font-blogBody prose-p:leading-8
                 prose-h1:text-primary prose-h1:font-heading
                 prose-h2:text-primary prose-h2:font-heading
                    prose-h3:text-primary prose-h3:font-heading
                    prose-h4:text-primary prose-h4:font-heading
                    prose-h5:text-primary prose-h5:font-heading
                    prose-h6:text-primary prose-h6:font-heading
                 dark:prose-strong:text-primary/70
                 "
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </>
  );
};

export default MdRender;
