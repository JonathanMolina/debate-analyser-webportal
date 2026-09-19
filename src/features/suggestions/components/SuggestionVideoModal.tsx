import { FC } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { Modal } from '@/components/Modal/Modal';
import { Button } from '@/components/Button/Button';
import type { DebateSuggestion } from '../types/suggestion.types';

export interface SuggestionVideoModalProps {
  suggestion: DebateSuggestion | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestionVideoModal: FC<SuggestionVideoModalProps> = ({
  suggestion,
  isOpen,
  onClose
}) => {
  if (!suggestion) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Play size={18} className="text-primary fill-primary/30" />
          <span className="truncate max-w-xl">{suggestion.title}</span>
        </div>
      }
      subtitle={suggestion.debaters ? `Debatedores: ${suggestion.debaters}` : undefined}
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Video Player Embed */}
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-border">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${suggestion.youtubeVideoId}?autoplay=1&rel=0`}
            title={suggestion.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Details & Direct YouTube Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-text-muted">
            Sugerido por <span className="font-semibold text-text-main">{suggestion.submittedBy}</span>
          </div>

          <a
            href={suggestion.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button variant="outline" size="sm" icon={<ExternalLink size={14} />}>
              Abrir no YouTube
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
};
