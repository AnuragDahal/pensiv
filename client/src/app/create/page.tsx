"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, Pen, Strikethrough, Heading } from "lucide-react";
import { useState } from "react";

const Tiptap = () => {
  const [title, setTitle] = useState("");
  const [metaData, setMetaData] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl min-h-[300px] w-full border rounded-md p-4 focus:outline-none",
      },
    },
    content: "<p>Start writing your blog post here...</p>",
  });

  const handleSubmit = () => {
    if (!editor) return;
    const content = editor.getHTML();
    console.log({ title, metaData, content });
  };

  return (
    <div className="flex flex-col items-center space-y-8 w-full min-h-screen p-4 mx-auto container max-w-4xl">
      <h1 className="font-bold text-xl">Create a new blog</h1>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter blog title"
        className="w-full"
      />
      <Input
        value={metaData}
        onChange={(e) => setMetaData(e.target.value)}
        placeholder="Enter meta description"
        className="w-full"
      />
      <div className="w-full rounded-md relative">
        {editor && (
          <BubbleMenu
            className="flex gap-1 p-1 rounded-lg bg-white border shadow-lg"
            tippyOptions={{ duration: 100 }}
            editor={editor}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-secondary" : ""}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-secondary" : ""}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "bg-secondary" : ""}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={editor.isActive("heading") ? "bg-secondary" : ""}
            >
              <Heading className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-secondary" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </BubbleMenu>
        )}
        <EditorContent editor={editor} />
      </div>
      <Button
        onClick={handleSubmit}
        className="flex items-center justify-center space-x-2"
      >
        <span>Submit</span>
        <Pen size={24} />
      </Button>
    </div>
  );
};

export default Tiptap;
