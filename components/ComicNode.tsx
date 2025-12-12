import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Orientation } from '../types';

interface ComicNodeData {
  url?: string;
  prompt: string;
  orientation: Orientation;
  isLoading?: boolean;
}

const ComicNode = ({ data, selected }: NodeProps<ComicNodeData>) => {
  const isPortrait = data.orientation === 'portrait';
  
  return (
    <div 
      className={`
        group relative bg-card transition-all duration-300
        ${selected ? 'ring-2 ring-cyan shadow-[0_0_30px_rgba(0,229,255,0.2)]' : 'ring-1 ring-gray-800 hover:ring-gray-600'}
        ${isPortrait ? 'w-[250px]' : 'w-[400px]'}
      `}
    >
      {/* Input Handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-cyan !w-3 !h-3 !-left-1.5 !rounded-none z-50 transition-transform hover:scale-150" 
      />

      {/* Header / Title Bar */}
      <div className="bg-[#121317] border-b border-gray-800 px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] font-mono text-cyan uppercase tracking-wider">
            {data.isLoading ? 'Rendering...' : 'Panel Node'}
        </span>
        <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Content Area */}
      <div className={`relative bg-black w-full overflow-hidden ${isPortrait ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {data.isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F0F12]">
                 <div className="w-12 h-12 border-4 border-gray-800 border-t-amber animate-spin rounded-full mb-4"></div>
                 <p className="text-amber font-mono text-[10px] animate-pulse">GENERATING PIXELS</p>
            </div>
        ) : (
            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
                 <img 
                    src={data.url} 
                    alt="Comic Panel" 
                    className="w-full h-full object-cover"
                    draggable={false}
                 />
                 {/* Scanline Overlay */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
            </div>
        )}
      </div>

      {/* Footer / Prompt */}
      <div className="bg-[#15161C] p-3 border-t border-gray-800">
        <p className="text-[10px] text-textSecondary font-mono leading-relaxed line-clamp-3">
            {data.prompt}
        </p>
      </div>

      {/* Output Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-cyan !w-3 !h-3 !-right-1.5 !rounded-none z-50 transition-transform hover:scale-150" 
      />
      
      {/* Decorative Neo-Brutalist Shadow (Hard Edge) */}
      <div className={`absolute -bottom-2 -right-2 w-full h-full border-r-2 border-b-2 border-gray-800 -z-10 ${selected ? 'border-cyan' : ''}`} />
    </div>
  );
};

export default memo(ComicNode);
