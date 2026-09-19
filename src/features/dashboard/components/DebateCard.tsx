import { FC } from 'react';
import { Link } from 'react-router';
import { Play, CheckCircle, AlertTriangle, Trophy, Clock, Calendar } from 'lucide-react';
import type { DebateJob } from '@/features/debates/types/debate.types';

export interface DebateCardProps {
  debate: DebateJob;
}

export const DebateCard: FC<DebateCardProps> = ({ debate }) => {
  const winner = debate.metrics?.debateScore?.winner;
  const isDraw = Boolean(debate.metrics?.debateScore?.isDraw);
  const factChecksCount = debate.factChecks?.length ?? 0;
  const fallaciesCount = debate.fallacies?.length ?? 0;

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '20:40';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  // Thumbnail fallback
  const thumbnail =
    debate.thumbnailUrl ||
    (debate.youtubeId
      ? `https://img.youtube.com/vi/${debate.youtubeId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80');

  return (
    <Link
      to={`/debates/${debate.id}`}
      className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-border/90 hover:bg-surface-hover/60 transition-all shadow-sm hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1"
    >
      {/* Thumbnail Container (YouTube 16:9 ratio) */}
      <div className="relative aspect-video w-full bg-canvas overflow-hidden">
        <img
          src={thumbnail}
          alt={debate.title || 'Debate Audiovisual'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Video Duration Badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[11px] font-mono text-white flex items-center gap-1 font-semibold tracking-wide">
          <Clock size={11} />
          {formatDuration(debate.durationSeconds)}
        </div>

        {/* Category Pill */}
        {debate.category && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface/85 backdrop-blur-md text-[10px] font-mono font-medium text-text-muted border border-border">
            {debate.category}
          </div>
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/90 text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={22} className="ml-1 fill-black" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-bold text-sm text-text-main line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {debate.title || `Debate ${debate.speakers.map((s) => s.name).join(' vs ')}`}
          </h3>

          {/* Speakers Pill Row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {debate.speakers.map((speaker) => (
              <div
                key={speaker.name}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-surface-elevated text-[11px] text-text-muted border border-border/80"
              >
                {speaker.previewUrl && (
                  <img
                    src={speaker.previewUrl}
                    alt={speaker.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                )}
                <span className="font-medium text-text-main">{speaker.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer: Metrics preview and winner badge */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            {winner && !isDraw ? (
              <span className="flex items-center gap-1 text-[11px] text-primary font-bold">
                <Trophy size={12} />
                <span className="truncate max-w-[120px]">{winner}</span>
              </span>
            ) : isDraw ? (
              <span className="text-[11px] text-yellow-400 font-medium">Empate</span>
            ) : null}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-text-muted">
            <span className="flex items-center gap-0.5" title="Fatos checados">
              <CheckCircle size={11} className="text-emerald-400" />
              {factChecksCount}
            </span>
            <span className="flex items-center gap-0.5" title="Falácias identificadas">
              <AlertTriangle size={11} className="text-rose-400" />
              {fallaciesCount}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <Calendar size={10} />
              {formatDate(debate.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
