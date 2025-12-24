
interface ArticleRendererProps {
  content: string;
}
const ArticleRenderer = ({ content }: ArticleRendererProps) => {
  return (
    <article className="max-w-3xl mx-auto px-5 w-full prose prose-lg 
      prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-black
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
      prose-img:rounded-2xl prose-img:shadow-md prose-img:my-10 prose-img:w-full
      prose-p:leading-8 prose-p:text-black
      prose-li:text-black
      prose-strong:text-black
      prose-pre:bg-gray-900 prose-pre:shadow-lg prose-pre:overflow-x-auto prose-pre:rounded-xl
      break-words">
      <div 
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </article>
  );
};
export default ArticleRenderer;
