import React from 'react';
import { Orientation } from '../types';

interface SceneDirectorProps {
  description: string;
  setDescription: (desc: string) => void;
  orientation: Orientation;
  setOrientation: (orientation: Orientation) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const SceneDirector: React.FC<SceneDirectorProps> = ({
  description,
  setDescription,
  orientation,
  setOrientation,
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="flex flex-col gap-6 bg-card border-t border-gray-800 p-6 md:p-8">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display font-bold text-xl text-white uppercase tracking-tight">
            Visual Director
          </h2>
          <p className="text-textTertiary text-xs font-mono uppercase tracking-widest mt-1">
            Panel Imagery & Composition
          </p>
        </div>
        
        {/* Orientation Toggle */}
        <div className="flex bg-input rounded-sm p-1 gap-1">
          <button
            onClick={() => setOrientation('landscape')}
            className={`px-4 py-1.5 text-xs font-bold font-sans uppercase tracking-wider transition-all ${
              orientation === 'landscape'
                ? 'bg-cyan text-black shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-textSecondary hover:text-white'
            }`}
          >
            16:9
          </button>
          <button
            onClick={() => setOrientation('portrait')}
            className={`px-4 py-1.5 text-xs font-bold font-sans uppercase tracking-wider transition-all ${
              orientation === 'portrait'
                ? 'bg-cyan text-black shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-textSecondary hover:text-white'
            }`}
          >
            9:16
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the comic panel scene, characters, setting, and action..."
          className="w-full bg-input text-white border border-gray-700 focus:border-cyan outline-none p-4 font-mono text-sm h-32 resize-none transition-colors"
        />
        {/* Corner accents for textarea */}
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-textSecondary opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-textSecondary opacity-30 pointer-events-none" />
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !description.trim()}
        className={`
          relative w-full py-4 font-display font-bold text-lg uppercase tracking-widest
          transition-all duration-300 overflow-hidden
          ${isGenerating 
            ? 'bg-gray-800 text-amber cursor-wait' 
            : 'bg-cyan text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] active:scale-[0.99]'}
        `}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-3">
             <span className="animate-spin h-4 w-4 border-2 border-amber border-t-transparent rounded-full" />
             Rendering Panel...
          </span>
        ) : (
          <span>Generate Panel</span>
        )}
        
        {/* Pulse effect wrapper */}
        {!isGenerating && (
            <div className="absolute inset-0 bg-white/20 scale-0 active:scale-100 transition-transform duration-300 rounded-full origin-center" />
        )}
      </button>
    </div>
  );
};

export default SceneDirector;
