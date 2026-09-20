import { FC } from 'react';
import { Play } from 'lucide-react';
import { DebaterAvatar } from '@/components/DebaterAvatar';
import type { TurnItem, SpeakerInput } from '../types/debate.types';

export interface DebateTimelineProps {
  timeline?: TurnItem[];
  speakers?: SpeakerInput[];
  currentTimestamp?: number;
  maxHeightClass?: string;
  className?: string;
  onSeek: (seconds: number) => void;
}

export const DebateTimeline: FC<DebateTimelineProps> = ({
  timeline = [],
  speakers = [],
  currentTimestamp,
  maxHeightClass = 'max-h-[620px]',
  className = '',
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
    <div
      className={`space-y-3 overflow-y-auto pr-1.5 sm:pr-2 scroll-smooth ${maxHeightClass} ${className}`}
      data-testid="debate-timeline-scroll"
    >
      {timeline.map((turn, index) => {
        const photo = getSpeakerPhoto(turn.speaker);
        const isActive =
          currentTimestamp !== undefined &&
          currentTimestamp >= turn.start &&
          currentTimestamp <= turn.end;
        const uniqueKey = `${turn.speaker}-${turn.start}-${turn.end}-${index}`;

        return (
          <div
            key={uniqueKey}
            className={`p-3.5 sm:p-4 bg-surface border rounded-2xl flex flex-col sm:flex-row gap-3 transition-all ${
              isActive
                ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-md'
                : 'border-border hover:border-border/90 hover:bg-surface-hover/40'
            }`}
          >
            {/* Speaker & Timestamp Info */}
            <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:w-40 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <DebaterAvatar name={turn.speaker} photoUrl={photo} size="sm" />
                <span className="text-xs font-bold text-text-main truncate">
                  {turn.speaker}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSeek(turn.start)}
                title="Reproduzir vídeo a partir deste ponto"
                className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-primary text-black border-primary font-bold shadow-sm'
                    : 'bg-canvas text-primary border-border hover:border-primary/50 hover:bg-primary/10'
                }`}
              >
                <Play size={10} className={isActive ? 'fill-black' : 'fill-primary'} />
                <span>
                  {formatTime(turn.start)} - {formatTime(turn.end)}
                </span>
              </button>
            </div>

            {/* Turn Text */}
            <div className="flex-1 space-y-2 min-w-0">
              <p className="text-xs sm:text-sm text-text-main/90 leading-relaxed break-words">
                "{turn.text}"
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-text-muted">
                <span>
                  Temperatura tonal: <strong>{turn.temperature.toFixed(2)}</strong>
                </span>
                {turn.confidence !== undefined && (
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

