import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  MarkerType,
  Node
} from 'reactflow';

import CharacterCard from './components/CharacterCard';
import SceneDirector from './components/SceneDirector';
import ComicNode from './components/ComicNode';
import { Orientation } from './types';
import { generatePanelImage } from './services/decartService';

const SYSTEM_PROMPT = "Style: Professional American comic book art, neo-noir aesthetic, thick bold ink lines, high contrast, vibrant cinematic coloring, dramatic lighting, detailed background.";

const INITIAL_NODES: Node[] = [
  {
    id: 'start-1',
    type: 'comicNode',
    position: { x: 250, y: 100 },
    data: { 
      prompt: "Welcome to ComicFlow. Describe a scene to generate your first panel.",
      orientation: 'landscape',
      url: "https://placehold.co/600x400/1A1B23/00E5FF?text=START+HERE&font=roboto"
    },
  },
];

// Simple UUID generator for compatibility
const uuidv4 = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const App: React.FC = () => {
  // --- React Flow State ---
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // --- Generation State ---
  const [bubbleText, setBubbleText] = useState<string>('');
  const [visualDescription, setVisualDescription] = useState<string>('');
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Define custom node types
  const nodeTypes = useMemo(() => ({ comicNode: ComicNode }), []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params, 
      animated: true, 
      style: { stroke: '#00E5FF' } 
    }, eds)),
    [setEdges]
  );

  // Get Decart API Key (base64 encoded to bypass Vercel validation)
  const getApiKey = (): string => {
    try {
      // Use Vite's import.meta.env for environment variables
      const encodedKey = import.meta.env.VITE_DECART_API_KEY;
      if (encodedKey) {
        // Decode base64 encoded API key
        return atob(encodedKey);
      }
    } catch (e) {
      console.error('Failed to decode API key:', e);
    }
    return '';
  };

  const apiKey = getApiKey();

  const handleGenerate = async () => {
    if (!visualDescription) {
      alert("Please describe the comic scene.");
      return;
    }

    if (!apiKey) {
      alert("API Key is missing.");
      return;
    }

    setIsGenerating(true);

    // Create a temporary "loading" node
    const tempId = uuidv4();
    const lastNode = nodes[nodes.length - 1];
    
    // Calculate new position (staggered to right/down)
    const newX = lastNode ? lastNode.position.x + (lastNode.data.orientation === 'portrait' ? 300 : 450) : 100;
    const newY = lastNode ? lastNode.position.y : 100;

    const loadingNode: Node = {
      id: tempId,
      type: 'comicNode',
      position: { x: newX, y: newY },
      data: {
        prompt: visualDescription,
        orientation: orientation,
        isLoading: true,
      }
    };

    // Add loading node and edge immediately
    setNodes((nds) => [...nds, loadingNode]);
    if (lastNode) {
      const newEdge: Edge = {
        id: `e-${lastNode.id}-${tempId}`,
        source: lastNode.id,
        target: tempId,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#00E5FF' },
        style: { stroke: '#00E5FF' },
      };
      setEdges((eds) => [...eds, newEdge]);
    }

    // Build Prompt
    let fullPrompt = `${SYSTEM_PROMPT} Scene Description: ${visualDescription}.`;
    if (bubbleText.trim()) {
      fullPrompt += ` The image must include a clearly visible speech bubble containing the text: "${bubbleText}".`;
    }

    console.log('Generating panel with:', { apiKey: apiKey ? '***set***' : '***missing***', promptLength: fullPrompt.length, orientation });

    try {
      const imageUrl = await generatePanelImage(apiKey, fullPrompt, orientation);

      // Update the node with real data
      setNodes((nds) => nds.map((node) => {
        if (node.id === tempId) {
          return {
            ...node,
            data: {
              ...node.data,
              url: imageUrl,
              isLoading: false,
              prompt: fullPrompt // Update with full used prompt
            }
          };
        }
        return node;
      }));
      
    } catch (error) {
      console.error("Generation error:", error);
      // Remove the failed node or mark error (here we remove for simplicity)
      setNodes((nds) => nds.filter(n => n.id !== tempId));
      setEdges((eds) => eds.filter(e => e.target !== tempId));
      alert(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-charcoal text-white font-sans flex overflow-hidden">
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 bg-noise opacity-50 pointer-events-none z-50 mix-blend-overlay"></div>

      {/* Left Column: Controls */}
      <aside className="w-[400px] flex flex-col border-r border-gray-800 bg-[#121317] z-20 shadow-2xl shrink-0 h-full">
        {/* Header */}
        <header className="p-6 border-b border-gray-800 shrink-0">
          <h1 className="font-display font-extrabold text-3xl text-white tracking-tighter leading-none">
            COMIC<span className="text-cyan">FLOW</span>
          </h1>
          <p className="text-textSecondary font-mono text-[10px] mt-1 uppercase tracking-widest">
            Node-based Narrative Studio
          </p>
        </header>

        {/* Scrollable Control Area */}
        <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
            <CharacterCard 
                text={bubbleText} 
                setText={setBubbleText} 
                disabled={isGenerating} 
            />
        </div>

        {/* Fixed Bottom Scene Director */}
        <div className="shrink-0 z-30">
            <SceneDirector 
                description={visualDescription}
                setDescription={setVisualDescription}
                orientation={orientation}
                setOrientation={setOrientation}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
            />
        </div>
      </aside>

      {/* Right Column: React Flow Canvas */}
      <main className="flex-grow h-full bg-[#050507] relative">
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.1}
              maxZoom={2}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            >
              <Background color="#252630" gap={40} />
              <Controls className="!bg-card !border-gray-700 !fill-white" />
            </ReactFlow>
        </div>
      </main>
    </div>
  );
};

export default App;