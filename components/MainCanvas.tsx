import React from 'react';
import { ComicPanel } from '../types';

interface MainCanvasProps {
  currentPanel: ComicPanel | null;
  isGenerating: boolean;
}

const MainCanvas: React.FC<MainCanvasProps> = ({ currentPanel, isGenerating }) => {
  return (
    <div className="flex-grow bg-[#050507] relative flex items-center justify-center p-8 overflow-hidden min-h-[500px]">
      
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
            backgroundImage: `linear-gradient(#252630 1px, transparent 1px), linear-gradient(90deg, #252630 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}
      />

      {/* Empty State */}
      {!currentPanel && !isGenerating && (
        <div className="text-center z-10 opacity-40 select-none">
          <h3 className="font-display text-4xl text-gray-700 uppercase mb-2">ComicFlow Studio</h3>
          <p className="font-mono text-sm text-gray-600">Waiting for input stream...</p>
        </div>
      )}

      {/* Loading State Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
           <div className="relative">
             <div className="w-16 h-16 border-4 border-gray-700 border-t-amber animate-spin rounded-full"></div>
             <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-amber animate-pulse">Processing</div>
           </div>
           <p className="mt-4 font-sans text-amber text-sm tracking-widest uppercase animate-pulse">
             Diffusing Reality
           </p>
        </div>
      )}

      {/* Image Display */}
      {currentPanel && (
        <div 
            key={currentPanel.id}
            className={`
                relative z-20 shadow-2xl transition-all duration-500 ease-out
                ${currentPanel.orientation === 'portrait' ? 'h-full max-h-[80vh] aspect-[9/16]' : 'w-full max-w-[90%] aspect-[16/9]'}
                ${isGenerating ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100 blur-0'}
            `}
        >
            <div className="absolute -inset-1 bg-cyan opacity-20 blur-lg animate-pulse"></div>
            <img 
                src={currentPanel.url} 
                alt={currentPanel.prompt} 
                className="w-full h-full object-cover border-4 border-cyan shadow-[0_0_30px_rgba(0,229,255,0.15)]"
            />
            
            {/* Metadata Overlay (On Hover) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
                <p className="text-xs font-mono text-cyan truncate">{currentPanel.prompt}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default MainCanvas;
