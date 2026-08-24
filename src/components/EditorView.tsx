"use client";

import { useEffect, useMemo, useState } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

type EditorViewProps = {
  initialContent: string;
  onChange: (markdown: string) => void;
  className?: string;
};

export default function EditorView({ initialContent, onChange, className = "max-w-3xl mx-auto w-full h-full p-8 md:p-12" }: EditorViewProps) {
  // Creates a new editor instance.
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadInitialHTML() {
      const e = BlockNoteEditor.create();
      if (initialContent) {
        const blocks = await e.tryParseMarkdownToBlocks(initialContent);
        e.replaceBlocks(e.document, blocks);
      }
      if (isMounted) setEditor(e);
    }
    loadInitialHTML();
    return () => { isMounted = false; };
  }, []);

  if (!editor) {
    return <div className="h-full flex items-center justify-center text-gray-500">Завантаження редактора...</div>;
  }

  return (
    <div className={className}>
      <BlockNoteView
        editor={editor}
        theme="dark"
        onChange={async () => {
          // Save the content as Markdown
          const markdown = await editor.blocksToMarkdownLossy(editor.document);
          onChange(markdown);
        }}
      />
    </div>
  );
}
