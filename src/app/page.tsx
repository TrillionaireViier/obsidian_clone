"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Search, Settings, PanelLeftClose, PanelLeft, FolderClosed, Network } from "lucide-react";
import EditorView from "@/components/EditorView";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

export default function ObsidianClone() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Load notes from LocalStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("obsidian_notes");
    let loadedNotes = [];
    if (savedNotes) {
      loadedNotes = JSON.parse(savedNotes);
      setNotes(loadedNotes);
    } else {
      // Initialize with a welcome note
      const welcomeNote = {
        id: Date.now().toString(),
        title: "Ласкаво просимо до вашого нового Obsidian Clone!",
        content: "# Привіт!\nЦе ваш локальний застосунок для нотаток. Всі дані зберігаються прямо у вашому браузері.\n\n## Що можна зробити:\n- Створювати нові нотатки за допомогою кнопки `+`.\n- Натисніть `/` щоб відкрити **Notion** меню та додати блоки (заголовки, списки тощо).\n- Натисніть кнопку **Граф (Mindmap)** зліва, щоб побачити мапу нотаток.\n- Шукати нотатки на боковій панелі.",
        updatedAt: Date.now(),
      };
      loadedNotes = [welcomeNote];
      setNotes(loadedNotes);
    }

    // Check if there's a noteId in the URL
    const searchParams = new URLSearchParams(window.location.search);
    const urlNoteId = searchParams.get('noteId');
    if (urlNoteId && loadedNotes.some((n: Note) => n.id === urlNoteId)) {
      setActiveNoteId(urlNoteId);
      // Clean up URL without reload
      window.history.replaceState({}, '', '/');
    } else if (loadedNotes.length > 0) {
      setActiveNoteId(loadedNotes[0].id);
    }
  }, []);

  // Save notes to LocalStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("obsidian_notes", JSON.stringify(notes));
    }
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Без назви",
      content: "",
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNoteContent = (content: string) => {
    if (!activeNoteId) return;
    setNotes(notes.map((note) => {
      if (note.id === activeNoteId) {
        // Simple heuristic to extract title from the first line if it's a heading
        const firstLine = content.split('\n')[0];
        let title = note.title;
        if (firstLine.startsWith('# ')) {
          title = firstLine.replace('# ', '').trim();
        } else if (firstLine.trim().length > 0) {
          title = firstLine.substring(0, 30) + (firstLine.length > 30 ? '...' : '');
        } else {
          title = "Без назви";
        }
        
        return { ...note, content, title, updatedAt: Date.now() };
      }
      return note;
    }));
  };

  const generateMockNotes = () => {
    const newNotes: Note[] = [];
    const topics = ["React", "Next.js", "TypeScript", "TailwindCSS", "Node.js", "GraphQL", "Zustand", "Redux", "Vercel", "WebSockets"];
    
    for (let i = 0; i < 30; i++) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      newNotes.push({
        id: `mock-${Date.now()}-${i}`,
        title: `Нотатка про ${randomTopic} #${i + 1}`,
        content: `# ${randomTopic} #${i + 1}\n\nЦе тестова нотатка, згенерована автоматично для перевірки відображення графа (Mindmap).\n\n- Тестовий пункт 1\n- Тестовий пункт 2`,
        updatedAt: Date.now() - Math.floor(Math.random() * 10000000),
      });
    }
    
    setNotes([...newNotes, ...notes]);
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden">
      
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 bg-[#252526] border-r border-[#333333] flex flex-col shrink-0 flex-none transition-all duration-300">
          
          {/* Sidebar Header / Actions */}
          <div className="flex items-center justify-between p-3 border-b border-[#333333]">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <FolderClosed size={16} className="text-gray-400" />
              Obsidian Clone
            </div>
            <div className="flex gap-1">
              <button onClick={createNote} className="p-1 hover:bg-[#333333] rounded text-gray-400 hover:text-white transition-colors" title="Нова нотатка">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Sidebar Features */}
          <div className="p-2 border-b border-[#333333]">
            <Link
              href="/mindmap"
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded text-left transition-colors text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-300`}
            >
              <Network size={14} className="shrink-0" />
              <span>Мапа зв'язків (Mindmap)</span>
            </Link>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Пошук нотаток..." 
                className="w-full bg-[#1e1e1e] border border-[#333333] rounded text-sm py-1.5 pl-8 pr-3 text-gray-300 focus:outline-none focus:border-[#4d4d4d] placeholder-gray-600 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* File Explorer */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-0.5">
            <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2 mt-1">Всі нотатки</div>
            {filteredNotes.map(note => (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded text-left truncate transition-colors ${
                  activeNoteId === note.id ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-300'
                }`}
              >
                <FileText size={14} className="shrink-0" />
                <span className="truncate">{note.title}</span>
              </button>
            ))}
            {filteredNotes.length === 0 && (
              <div className="text-center text-xs text-gray-600 mt-4">Немає нотаток</div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-[#333333] flex items-center justify-between text-gray-500">
            <button className="p-1 hover:text-white transition-colors"><Settings size={16} /></button>
            <button onClick={generateMockNotes} className="text-xs text-gray-400 hover:text-white px-2 py-1 border border-[#333333] rounded bg-[#2a2d2e] transition-colors">
              +30 Тест-Нотаток
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
        {/* Editor Top Bar */}
        <div className="h-12 flex items-center px-4 border-b border-[#333333] shrink-0 bg-[#1e1e1e] z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
            </button>
            <div className="text-sm font-medium text-gray-400 truncate">
              {activeNote ? activeNote.title : "Виберіть нотатку"}
            </div>
          </div>
        </div>

        {/* Dynamic Area (Editor or Mindmap) */}
        <div className="flex-1 overflow-y-auto relative">
          {activeNote ? (
            <EditorView 
              key={activeNote.id} 
              initialContent={activeNote.content} 
              onChange={updateNoteContent} 
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600">
              Створіть нову нотатку або виберіть існуючу на панелі зліва.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
