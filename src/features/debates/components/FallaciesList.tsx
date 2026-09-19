import { FC } from 'react';
import { AlertOctagon, Play } from 'lucide-react';
import type { FallacyItem } from '../types/debate.types';

export interface FallaciesListProps {
  fallacies?: FallacyItem[];
  onSeek: (seconds: number) => void;
}

export const FallaciesList: FC<FallaciesListProps> = ({
  fallacies = [],
  onSeek
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (fallacies.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
        Nenhuma falácia retórica evidente foi detectada neste debate.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fallacies.map((item) => (
        <div
          key={item.id}
          className="p-5 bg-surface border border-rose-950/40 rounded-2xl space-y-3 hover:border-rose-900/60 transition-all shadow-sm"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-text-main">
                {item.speaker}
              </span>
              <span className="text-text-muted">•</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                {item.type}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onSeek(item.timestamp)}
              className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-canvas text-primary border border-border hover:border-primary/40 transition-colors cursor-pointer"
            >
              <Play size={10} className="fill-primary" />
              <span>Timestamp: {formatTime(item.timestamp)}</span>
            </button>
          </div>

          {/* Quote */}
          <div className="space-y-1">
            <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider">
              Trecho com Raciocínio Falacioso:
            </span>
            <blockquote className="text-sm font-medium text-text-main/90 italic bg-canvas/60 p-3.5 rounded-xl border border-border/40">
              "{item.quote}"
            </blockquote>
          </div>
        </div>
      ))}
    </div>
  );
};
