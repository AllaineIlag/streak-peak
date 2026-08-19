"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect, useState, useRef } from "react";
import { Json } from "@/lib/database.types";
import { useDebounce } from "@/hooks/useDebounce";

interface RichTextEditorProps {
  initialContent?: Json;
  onUpdate: (content: Json) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-border bg-muted/30 sticky top-0 z-10 rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 text-sm rounded-md transition-colors ${
          editor.isActive("bold") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 text-sm rounded-md transition-colors ${
          editor.isActive("italic") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        Italic
      </button>
      <div className="w-px h-6 bg-border mx-1 my-auto" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 text-sm font-bold rounded-md transition-colors ${
          editor.isActive("heading", { level: 1 }) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 text-sm font-semibold rounded-md transition-colors ${
          editor.isActive("heading", { level: 2 }) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        H2
      </button>
      <div className="w-px h-6 bg-border mx-1 my-auto" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 text-sm rounded-md transition-colors ${
          editor.isActive("bulletList") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 text-sm rounded-md transition-colors ${
          editor.isActive("orderedList") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        Numbered List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`px-2 py-1 text-sm rounded-md transition-colors ${
          editor.isActive("taskList") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        Task List
      </button>
      <div className="w-px h-6 bg-border mx-1 my-auto" />
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 text-sm rounded-md transition-colors ${
          editor.isActive("blockquote") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        Quote
      </button>
    </div>
  );
};

export function RichTextEditor({ initialContent, onUpdate }: RichTextEditorProps) {
  // We use state to track the JSON content so we can debounce the onUpdate call
  const [content, setContent] = useState<Json>(initialContent || {});
  const debouncedContent = useDebounce(content, 1000);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: initialContent as any,
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert sm:prose-base focus:outline-none max-w-none p-4 min-h-[500px]",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Get the document as JSON
      const json = editor.getJSON();
      setContent(json as unknown as Json);
    },
  });

  const onUpdateRef = useRef(onUpdate);
  const isFirstMount = useRef(true);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Only call onUpdate when debouncedContent changes to prevent spamming state/DB
    if (debouncedContent && Object.keys(debouncedContent).length > 0) {
      onUpdateRef.current(debouncedContent);
    }
  }, [debouncedContent]);

  // We don't need to force update editor content on initialContent change
  // because the component is completely remounted (via key prop) when selecting a different note.
  // This prevents cursor jumping when the debounced save updates the parent state.

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
