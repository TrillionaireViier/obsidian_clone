"use client";

import { useEffect, useMemo, useState } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

type EditorViewProps = {
  initialContent: string;
  onChange: (markdown: string) => void;
};

export default function EditorView({ initialContent, onChange }: EditorViewProps) {
  // Creates a new editor instance.
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  useEffect(() => {
    async function loadInitialHTML() {
      const e = BlockNoteEditor.create();
      if (initialContent) {
        const blocks = await e.tryParseMarkdownToBlocks(initialContent);
        e.replaceBlocks(e.document, blocks);
      }
      setEditor(e);
    }
    loadInitialHTML();
  }, [initialContent]);

  if (!editor) {
    return <div className="h-full flex items-center justify-center text-gray-500">Завантаження редактора...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto w-full h-full p-8 md:p-12">
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
