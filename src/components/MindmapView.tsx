"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

type MindmapViewProps = {
  notes: Note[];
  onNodeClick: (noteId: string) => void;
};

export default function MindmapView({ notes, onNodeClick }: MindmapViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    // 1. Generate Nodes
    setNodes((currentNodes) => {
      const existingNodesMap = new Map(currentNodes.map(n => [n.id, n]));
      
      return notes.map((note) => {
        // If node already exists, preserve its position but update its label
        if (existingNodesMap.has(note.id)) {
          const ex = existingNodesMap.get(note.id)!;
          return {
            ...ex,
            data: { label: note.title }
          };
        }
        
        // If it's a new node, scatter it randomly within a 2000x2000 circle
        const radius = 1000 * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        
        return {
          id: note.id,
          position: { x, y },
          data: { label: note.title },
          style: {
            background: '#252526',
            color: '#e2e2e2',
            border: '1px solid #444444',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer'
          }
        };
      });
    });

    // 2. Generate Edges (parse [[Title]] links)
    const newEdges: Edge[] = [];
    const edgeSet = new Set<string>();

    notes.forEach((sourceNote) => {
      // Safely handle empty content
      const content = sourceNote.content || "";
      
      // Regex to match [[Anything inside]]
      const regex = /\[\[(.*?)\]\]/g;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        const targetTitle = match[1].trim();
        const targetNote = notes.find(n => n.title === targetTitle);
        
        if (targetNote && targetNote.id !== sourceNote.id) {
          const edgeId = `e-${sourceNote.id}-${targetNote.id}`;
          
          if (!edgeSet.has(edgeId)) {
            edgeSet.add(edgeId);
            newEdges.push({
              id: edgeId,
              source: sourceNote.id,
              target: targetNote.id,
              animated: true, // Cool flowing animation for links
              style: { stroke: '#7c3aed', strokeWidth: 2, opacity: 0.7 } // Purple glowing links
            });
          }
        }
      }
    });

    setEdges(newEdges);
  }, [notes, setNodes, setEdges]);

  return (
    <div className="w-full h-full" style={{ background: '#121212' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeClick(node.id)}
        colorMode="dark"
        fitView
      >
        <Controls />
        <Background color="#333" gap={20} size={1.5} />
      </ReactFlow>
    </div>
  );
}
