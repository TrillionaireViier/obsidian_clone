"use client";

import { useState, useEffect } from "react";
import MindmapView from "@/components/MindmapView";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

export default function GraphPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem("obsidian_notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

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

  return (
    <div className="flex h-screen bg-[#1e1e1e] flex-col overflow-hidden text-gray-300">
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
       <div className="flex-1 relative">
         <MindmapView 
           notes={notes} 
           onNodeClick={(id) => router.push(`/?noteId=${id}`)} 
         />
       </div>
    </div>
  );
}
