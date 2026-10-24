import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface FloatingAudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({
  isPlaying,
  onToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTune, setSelectedTune] = useState<'canon' | 'gentleRiver' | 'romanticWaltz'>('canon');

  const handleTuneChange = (tune: 'canon' | 'gentleRiver' | 'romanticWaltz') => {
    setSelectedTune(tune);
    audioEngine.setTune(tune);
    if (!isPlaying) {
      onToggle();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expanded Playlist / Tunes Menu */}
      {isExpanded && (
        <div className="mb-2 p-3 rounded-2xl bg-[#140728]/95 border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.3)] backdrop-blur-xl text-white text-xs space-y-2 animate-fadeIn w-56">
          <div className="flex items-center justify-between pb-1.5 border-b border-purple-500/20 text-[11px] font-semibold text-pink-300 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-pink-400" />
              <span>Melodías de Amor</span>
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {[
              { id: 'canon' as const, title: 'Canon in D (Pachelbel)', desc: 'Piano romántico suave' },
              { id: 'gentleRiver' as const, title: 'Río de Amor', desc: 'Arpegios relajantes' },
              { id: 'romanticWaltz' as const, title: 'Vals de Medianoche', desc: 'Melodía apasionada' }
            ].map((tune) => (
              <button
                key={tune.id}
                onClick={() => handleTuneChange(tune.id)}
                type="button"
                className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                  selectedTune === tune.id
                    ? 'bg-purple-900/70 border border-pink-400/50 text-pink-200'
                    : 'hover:bg-purple-950/50 text-slate-300'
                }`}
              >
                <div>
                  <p className="font-semibold">{tune.title}</p>
                  <p className="text-[10px] text-slate-400">{tune.desc}</p>
                </div>
                {selectedTune === tune.id && isPlaying && (
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0 animate-spin" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Floating Pill Widget */}
      <div className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-gradient-to-r from-[#17082e]/95 to-[#240b46]/95 border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.35)] backdrop-blur-xl">
        {/* Equalizer animation bars */}
        <div className="flex items-center gap-0.5 h-4 px-1" title="Visualizador musical">
          <span
            className={`w-1 bg-pink-400 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-4 animate-pulse' : 'h-1.5 opacity-50'
            }`}
          />
          <span
            className={`w-1 bg-purple-400 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-3 animate-pulse delay-75' : 'h-1 opacity-50'
            }`}
          />
          <span
            className={`w-1 bg-pink-300 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-5 animate-pulse delay-150' : 'h-2 opacity-50'
            }`}
          />
        </div>

        {/* Tune label & expand toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
          className="text-left pr-1 cursor-pointer group"
          title="Cambiar melodía"
        >
          <p className="text-[11px] font-bold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1">
            <span>{selectedTune === 'canon' ? 'Canon in D' : selectedTune === 'gentleRiver' ? 'Río de Amor' : 'Vals'}</span>
            <ChevronUp className={`w-3 h-3 text-pink-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </p>
          <p className="text-[9px] text-purple-300/80 font-medium">
            {isPlaying ? 'Reproduciendo ♪' : 'En pausa'}
          </p>
        </button>

        {/* Big Round Play / Pause Button with Neon Glow */}
        <button
          onClick={onToggle}
          type="button"
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_22px_rgba(236,72,153,0.8)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title={isPlaying ? 'Pausar música' : 'Reproducir música'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-white ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
