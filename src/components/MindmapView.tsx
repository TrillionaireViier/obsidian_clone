"use client";

import { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
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
  // Create nodes from notes
  const initialNodes = useMemo(() => {
    return notes.map((note, index) => {
      // Very basic layout algorithm: grid placement
      const x = (index % 4) * 250 + 100;
      const y = Math.floor(index / 4) * 150 + 100;
      
      return {
        id: note.id,
        position: { x, y },
        data: { label: note.title },
        style: {
          background: '#252526',
          color: '#e2e2e2',
          border: '1px solid #333333',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }
      };
    });
  }, [notes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  return (
    <div className="w-full h-full" style={{ background: '#1e1e1e' }}>
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
        <MiniMap nodeStrokeColor="#444" nodeColor="#333" maskColor="rgba(0,0,0,0.7)" />
        <Background color="#333" gap={16} />
      </ReactFlow>
    </div>
  );
}
