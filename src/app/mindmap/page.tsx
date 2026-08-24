"use client";

import { useState, useEffect } from "react";
import MindmapView from "@/components/MindmapView";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import EditorView from "@/components/EditorView";

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

export default function GraphPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem("obsidian_notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const handleUpdateNote = (newContent: string) => {
    if (!selectedNoteId) return;
    
    setNotes(currentNotes => {
      const updatedNotes = currentNotes.map(n => {
        if (n.id === selectedNoteId) {
          // Extrapolate title
          const firstLine = newContent.split('\n')[0];
          let title = n.title;
          if (firstLine.startsWith('# ')) {
            title = firstLine.replace('# ', '').trim();
          } else if (firstLine.trim().length > 0) {
            title = firstLine.substring(0, 30) + (firstLine.length > 30 ? '...' : '');
          } else {
            title = "Без назви";
          }
          return { ...n, content: newContent, title, updatedAt: Date.now() };
        }
        return n;
      });
      localStorage.setItem("obsidian_notes", JSON.stringify(updatedNotes));
      return updatedNotes;
    });
  };

  const generateMockNotes = () => {
    const newNotes: Note[] = [];
    const topics = [
      "Штучний Інтелект", "Квантова Фізика", "React", "Next.js", "Ваврукік", 
      "Машинне Навчання", "Космос", "Чорні Діри", "Нейромережі", "Блокчейн",
      "Криптовалюта", "TypeScript", "TailwindCSS", "Дизайн", "Архітектура",
      "Філософія", "Історія", "Психологія", "Економіка", "Біологія",
      "Генетика", "Робототехніка", "Кібербезпека", "Марсохід", "SpaceX",
      "Відновлювана Енергія", "Медицина", "Nanotech", "Автоматизація", "Кінематограф",
      "Література", "Мистецтво", "Музика", "Спорт", "Кулінарія"
    ];
    
    for (let i = 0; i < 30; i++) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      newNotes.push({
        id: `mock-${Date.now()}-${i}`,
        title: `Нотатка про ${randomTopic} #${i + 1}`,
        content: `# ${randomTopic} #${i + 1}\n\nЦе тестова нотатка, згенерована автоматично для перевірки відображення графа (Mindmap).\n\n`,
        updatedAt: Date.now() - Math.floor(Math.random() * 10000000),
      });
    }

    // Add cross-links between mock notes
    for (let i = 0; i < newNotes.length; i++) {
      const numLinks = Math.floor(Math.random() * 4) + 1; // 1 to 4 links per note
      for (let j = 0; j < numLinks; j++) {
        const targetIndex = Math.floor(Math.random() * newNotes.length);
        if (targetIndex !== i) {
          newNotes[i].content += `- Див. також: [[${newNotes[targetIndex].title}]]\n`;
        }
      }
    }
    
    const updatedNotes = [...newNotes, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("obsidian_notes", JSON.stringify(updatedNotes));
  };

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  return (
    <div className="flex h-screen bg-[#1e1e1e] flex-col overflow-hidden text-gray-300 relative">
       <div className="h-12 border-b border-[#333333] flex items-center justify-between px-4 bg-[#252526] shrink-0 z-10 shadow-sm">
         <div className="flex items-center gap-4">
           <button 
             onClick={() => router.push('/')} 
             className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors bg-[#333333] px-3 py-1.5 rounded"
           >
             <ArrowLeft size={16}/> 
             Повернутися до редактора
           </button>
           <div className="text-sm font-semibold">
             Мапа зв'язків (Graph View)
           </div>
         </div>
         <button 
           onClick={generateMockNotes} 
           className="text-xs font-semibold text-[#9FE870] hover:text-[#85c95a] px-3 py-1.5 border border-[#9FE870]/30 rounded bg-[#9FE870]/10 transition-colors"
         >
           +30 Тест-Нотаток
         </button>
       </div>
       <div className="flex-1 relative flex">
         {/* Graph Area */}
         <div className="flex-1 relative">
           <MindmapView 
             notes={notes} 
             onNodeClick={(id) => setSelectedNoteId(id)} 
           />
         </div>

         {/* Side Panel for Note Preview */}
         {selectedNote && (
           <div className="w-[500px] bg-[#252526] border-l border-[#333333] flex flex-col shadow-2xl z-20 absolute right-0 top-0 bottom-0 animate-in slide-in-from-right-8 duration-300">
             <div className="p-4 border-b border-[#333333] flex justify-between items-center bg-[#1e1e1e]">
               <h3 className="font-bold text-white truncate pr-4">{selectedNote.title}</h3>
               <button 
                 onClick={() => setSelectedNoteId(null)}
                 className="text-gray-500 hover:text-white p-1 rounded hover:bg-[#333333] transition-colors"
               >
                 ✕
               </button>
             </div>
             <div className="flex-1 bg-[#1e1e1e] overflow-hidden">
               <EditorView 
                 key={selectedNote.id} 
                 initialContent={selectedNote.content} 
                 onChange={handleUpdateNote}
                 className="w-full h-full p-6 overflow-y-auto"
               />
             </div>
           </div>
         )}
       </div>
    </div>
  );
}
