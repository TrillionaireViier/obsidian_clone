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

  return (
    <div className="flex h-screen bg-[#1e1e1e] flex-col overflow-hidden text-gray-300">
       <div className="h-12 border-b border-[#333333] flex items-center px-4 bg-[#252526] shrink-0 z-10 shadow-sm">
         <button 
           onClick={() => router.push('/')} 
           className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors bg-[#333333] px-3 py-1.5 rounded"
         >
           <ArrowLeft size={16}/> 
           Повернутися до редактора
         </button>
         <div className="ml-4 text-sm font-semibold">
           Мапа зв'язків (Graph View)
         </div>
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
