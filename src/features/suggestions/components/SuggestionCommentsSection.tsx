import { FC } from 'react';
import { MessageSquare, Send, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { useSuggestionComments } from '../hooks/useSuggestionComments';

export interface SuggestionCommentsSectionProps {
  suggestionId: string;
}

const formatRelativeTime = (isoDate: string): string => {
  try {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'agora há pouco';
    if (diffMins < 60) return `há ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `há ${diffHours} h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'ontem';
    if (diffDays < 30) return `há ${diffDays} dias`;
    return new Date(isoDate).toLocaleDateString('pt-BR');
  } catch {
    return '';
  }
};

export const SuggestionCommentsSection: FC<SuggestionCommentsSectionProps> = ({
  suggestionId
}) => {
  const {
    comments,
    isLoading,
    authorName,
    setAuthorName,
    content,
    setContent,
    errorMessage,
    isSubmitting,
    handleSubmitComment
  } = useSuggestionComments(suggestionId);

  return (
    <div className="mt-4 pt-4 border-t border-border/70 space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-text-main">
        <MessageSquare size={14} className="text-primary" />
        <span>Comentários ({comments.length})</span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Seu nome (opcional)"
            maxLength={60}
            className="sm:w-1/3 px-3 py-1.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que você achou dessa sugestão? Adicione seu comentário..."
              maxLength={1000}
              className="w-full pl-3 pr-20 py-1.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                disabled={!content.trim()}
                className="h-7 px-2.5 text-[11px] rounded-lg"
                icon={<Send size={12} />}
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-status-false">
            <AlertCircle size={13} />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="text-xs text-text-muted py-2 text-center animate-pulse">
            Carregando comentários...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-xs text-text-muted/70 py-2 text-center italic">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-surface-elevated/70 border border-border/50 rounded-xl p-3 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between text-text-muted text-[11px]">
                <span className="font-semibold text-text-main flex items-center gap-1">
                  <User size={12} className="text-primary" />
                  {comment.authorName}
                </span>
                <span className="text-[10px]">{formatRelativeTime(comment.createdAt)}</span>
              </div>
              <p className="text-text-main/90 leading-relaxed break-words whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
