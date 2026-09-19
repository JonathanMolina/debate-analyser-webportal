import { FC } from 'react';
import { Clock, Play, User } from 'lucide-react';
import type { TurnItem, SpeakerInput } from '../types/debate.types';

export interface DebateTimelineProps {
  timeline?: TurnItem[];
  speakers?: SpeakerInput[];
  onSeek: (seconds: number) => void;
}

export const DebateTimeline: FC<DebateTimelineProps> = ({
  timeline = [],
  speakers = [],
  onSeek
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const getSpeakerPhoto = (name: string) => {
    const spk = speakers.find((s) => s.name.toLowerCase() === name.toLowerCase());
    return spk?.previewUrl;
  };

  if (timeline.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
        Nenhuma transcrição ou timeline disponível para este debate.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {timeline.map((turn, index) => {
        const photo = getSpeakerPhoto(turn.speaker);
        return (
          <div
            key={index}
            className="p-4 bg-surface border border-border rounded-2xl flex flex-col sm:flex-row gap-3 hover:border-border/90 hover:bg-surface-hover/40 transition-all"
          >
            {/* Speaker & Timestamp Info */}
            <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:w-44 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-surface-elevated border border-border overflow-hidden shrink-0">
                  {photo ? (
                    <img
                      src={photo}
                      alt={turn.speaker}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <User size={14} />
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-text-main truncate">
                  {turn.speaker}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSeek(turn.start)}
                className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg bg-canvas text-primary border border-border hover:border-primary/40 transition-colors cursor-pointer"
              >
                <Play size={10} className="fill-primary" />
                <span>{formatTime(turn.start)} - {formatTime(turn.end)}</span>
              </button>
            </div>

            {/* Turn Text */}
            <div className="flex-1 space-y-2">
              <p className="text-xs sm:text-sm text-text-main/90 leading-relaxed">
                "{turn.text}"
              </p>

              <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted">
                <span>
                  Temperatura tonal: <strong>{turn.temperature.toFixed(2)}</strong>
                </span>
                {turn.confidence && (
                  <span>
                    Confiança fonética: <strong>{(turn.confidence * 100).toFixed(0)}%</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
