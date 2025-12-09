import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
interface ArticleRendererProps {
  content: string;
}
const ArticleRenderer = ({ content }: ArticleRendererProps) => {
  return (
    <div className="max-w-4xl mx-auto dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw, // allows inline HTML, but still sanitized
          rehypeSanitize, // prevents XSS
          rehypeHighlight, // syntax highlighting
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
export default ArticleRenderer;
