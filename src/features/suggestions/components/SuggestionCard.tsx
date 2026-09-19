import { FC, useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Play, Calendar, User, CheckCircle2, Clock3 } from 'lucide-react';
import { Card } from '@/components/Card/Card';
import { Badge } from '@/components/Badge/Badge';
import { getYouTubeThumbnailUrl } from '../utils/youtube';
import { useSuggestionVote } from '../hooks/useSuggestionVote';
import { SuggestionCommentsSection } from './SuggestionCommentsSection';
import type { DebateSuggestion, SuggestionStatus } from '../types/suggestion.types';

export interface SuggestionCardProps {
  suggestion: DebateSuggestion;
  onWatchVideo: (suggestion: DebateSuggestion) => void;
}

const statusConfig: Record<SuggestionStatus, { label: string; variant: 'true' | 'disputed' | 'neutral' | 'primary'; icon: typeof Clock3 }> = {
  voting: { label: 'Em Votação', variant: 'disputed', icon: Clock3 },
  under_review: { label: 'Em Análise', variant: 'primary', icon: Clock3 },
  accepted: { label: 'Aprovado para Análise', variant: 'true', icon: CheckCircle2 },
  rejected: { label: 'Não Selecionado', variant: 'neutral', icon: Clock3 }
};

const formatTime = (isoDate: string): string => {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  } catch {
    return '';
  }
};

export const SuggestionCard: FC<SuggestionCardProps> = ({
  suggestion,
  onWatchVideo
}) => {
  const [showComments, setShowComments] = useState(false);

  const {
    userVote,
    likesCount,
    dislikesCount,
    isVoting,
    handleVote
  } = useSuggestionVote({
    suggestionId: suggestion.id,
    initialLikes: suggestion.likesCount,
    initialDislikes: suggestion.dislikesCount
  });

  const thumbnailUrl = getYouTubeThumbnailUrl(suggestion.youtubeVideoId);
  const statusInfo = statusConfig[suggestion.status] || statusConfig.voting;
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="flex flex-col justify-between border-border/80 hover:border-primary/40 transition-all shadow-md">
      <div className="space-y-4">
        {/* Top Media & Status */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black group">
          <img
            src={thumbnailUrl}
            alt={suggestion.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            onError={(e) => {
              // Fallback placeholder se thumbnail falhar
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Status Badge overlay */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant={statusInfo.variant}>
              <div className="flex items-center gap-1">
                <StatusIcon size={12} />
                <span>{statusInfo.label}</span>
              </div>
            </Badge>
          </div>

          {/* Play button overlay */}
          <button
            type="button"
            onClick={() => onWatchVideo(suggestion)}
            className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer"
            aria-label={`Assistir vídeo: ${suggestion.title}`}
          >
            <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play size={20} className="fill-black translate-x-0.5" />
            </div>
          </button>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h3
            onClick={() => onWatchVideo(suggestion)}
            className="text-base font-bold text-text-main hover:text-primary transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {suggestion.title}
          </h3>

          {suggestion.debaters && (
            <div className="text-xs text-primary/90 font-medium line-clamp-1">
              Debatedores: <span className="text-text-muted">{suggestion.debaters}</span>
            </div>
          )}

          {suggestion.description && (
            <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
              {suggestion.description}
            </p>
          )}
        </div>
      </div>

      {/* Meta info & Action bar */}
      <div className="mt-4 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between text-[11px] text-text-muted mb-3">
          <span className="flex items-center gap-1">
            <User size={12} className="text-text-muted/70" />
            {suggestion.submittedBy}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-text-muted/70" />
            {formatTime(suggestion.createdAt)}
          </span>
        </div>

        {/* Voting & Comments Bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Like / Dislike Counter */}
          <div className="flex items-center gap-1 bg-surface-elevated rounded-xl p-1 border border-border">
            <button
              type="button"
              onClick={() => handleVote('like')}
              disabled={isVoting}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                userVote === 'like'
                  ? 'bg-primary text-black shadow-sm'
                  : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
              }`}
              aria-label="Curtir sugestão"
            >
              <ThumbsUp size={14} className={userVote === 'like' ? 'fill-black' : ''} />
              <span>{likesCount}</span>
            </button>

            <div className="w-[1px] h-4 bg-border" />

            <button
              type="button"
              onClick={() => handleVote('dislike')}
              disabled={isVoting}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                userVote === 'dislike'
                  ? 'bg-status-false text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
              }`}
              aria-label="Não curtir sugestão"
            >
              <ThumbsDown size={14} className={userVote === 'dislike' ? 'fill-white' : ''} />
              <span>{dislikesCount}</span>
            </button>
          </div>

          {/* Comments Toggle Button */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              showComments
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-surface-elevated border-border text-text-muted hover:text-text-main hover:bg-surface-hover'
            }`}
          >
            <MessageSquare size={14} />
            <span>{suggestion.commentsCount || 0}</span>
          </button>
        </div>

        {/* Expandable Comments Thread */}
        {showComments && <SuggestionCommentsSection suggestionId={suggestion.id} />}
      </div>
    </Card>
  );
};
