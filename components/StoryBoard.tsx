import React from 'react';
import { ComicPanel } from '../types';

interface StoryBoardProps {
  history: ComicPanel[];
  onSelect: (panel: ComicPanel) => void;
  selectedId: string | undefined;
}

const StoryBoard: React.FC<StoryBoardProps> = ({ history, onSelect, selectedId }) => {
  return (
    <div className="h-48 bg-[#0F0F12] border-t border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">
          Storyboard Timeline
        </h3>
        <span className="text-xs font-mono text-textTertiary">
          {history.length} / 4 RECENT
        </span>
      </div>

      {history.length === 0 ? (
        <div className="h-24 border border-dashed border-gray-800 flex items-center justify-center text-textTertiary font-mono text-xs">
          [ NO GENERATION HISTORY ]
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 h-28">
          {history.map((panel, index) => (
            <button
              key={panel.id}
              onClick={() => onSelect(panel)}
              className={`
                relative group overflow-hidden border-2 transition-all duration-300 ease-spring
                ${panel.id === selectedId ? 'border-cyan -translate-y-1 shadow-[0_4px_12px_rgba(0,229,255,0.2)]' : 'border-gray-800 hover:border-gray-500 hover:-translate-y-1'}
              `}
              style={{
                animationDelay: `${index * 80}ms`
              }}
            >
              <img 
                src={panel.url} 
                alt="thumbnail" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
              />
              {/* Index Number */}
              <div className="absolute top-1 left-1 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5">
                0{history.length - index}
              </div>
            </button>
          ))}
          
          {/* Fill empty slots visually */}
          {[...Array(Math.max(0, 4 - history.length))].map((_, i) => (
             <div key={`empty-${i}`} className="bg-[#15161C] border border-gray-800/50 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-gray-800"></span>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryBoard;
