import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "@/lib/lowlight-setup";

/**
 * Centralized TipTap editor configuration
 */
export const editorExtensions = [
  StarterKit.configure({
    codeBlock: false, // Disable default code block to use CodeBlockLowlight
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-blue-600 hover:underline",
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: "javascript",
  }),
  TiptapImage.configure({
    inline: true,
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg max-w-full h-auto my-4",
    },
  }),
];

export const editorProps = {
  attributes: {
    class:
      "prose prose-lg max-w-none px-4 py-3 min-h-[400px] max-h-[500px] overflow-y-auto focus:outline-none",
  },
};
