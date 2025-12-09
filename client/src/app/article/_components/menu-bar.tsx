import {
  Bold,
  Code,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo,
  Undo,
} from "lucide-react";

export const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const buttons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      label: "Bold (Ctrl+B)",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      label: "Italic (Ctrl+I)",
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      label: "Code (Ctrl+E)",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      label: "Heading 2",
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      label: "Numbered List",
    },
    {
      icon: Link2,
      action: addLink,
      isActive: editor.isActive("link"),
      label: "Add Link",
    },
    { type: "divider" },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      label: "Undo (Ctrl+Z)",
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      label: "Redo (Ctrl+Y)",
    },
  ];

  return (
    <div className="flex gap-1 p-2 border-b bg-gray-50 flex-wrap">
      {buttons.map((btn, idx) =>
        btn.type === "divider" ? (
          <div key={idx} className="w-px bg-gray-300 mx-1" />
        ) : (
          <button
            key={idx}
            type="button"
            onClick={btn.action}
            title={btn.label}
            className={`p-2 rounded transition-colors ${
              btn.isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"
            }`}
          >
            {/* @ts-ignore */}
            <btn.icon />
          </button>
        )
      )}
    </div>
  );
};
