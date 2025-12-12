import React from 'react';

interface DialogueControlProps {
  text: string;
  setText: (text: string) => void;
  disabled: boolean;
}

const CharacterCard: React.FC<DialogueControlProps> = ({ text, setText, disabled }) => {
  return (
    <div className="bg-card border border-gray-800 p-6 flex flex-col gap-6 relative group overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-cyan" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-gray-700" />

      <div>
        <h2 className="font-display font-bold text-2xl mb-1 text-white uppercase tracking-tight">
          Narrative Idea
        </h2>
        <p className="text-textTertiary text-xs font-mono uppercase tracking-widest">
          Dialogue & Bubble Text
        </p>
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        <label className="text-textSecondary font-sans font-medium text-sm">Speech Bubble Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="Enter the text or idea that should appear inside the speech bubble..."
          className="w-full bg-input text-white border-l-2 border-transparent focus:border-cyan outline-none p-4 font-mono text-sm h-40 resize-none placeholder-gray-600 transition-all leading-relaxed"
        />
        <div className="text-xs text-textTertiary mt-2 font-mono">
           * This text will be generated inside the image.
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
