import { FC, useState, useId } from 'react';
import { AlertCircle, CheckCircle2, Video, Send } from 'lucide-react';
import { Modal } from '@/components/Modal/Modal';
import { Button } from '@/components/Button/Button';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../utils/youtube';
import type { SuggestionInput } from '../types/suggestion.types';

const YouTubeIcon: FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export interface SuggestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: SuggestionInput) => Promise<{ success: boolean; error?: string }>;
}

export const SuggestionFormModal: FC<SuggestionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const honeypotId = useId();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [debaters, setDebaters] = useState('');
  const [description, setDescription] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const videoId = extractYouTubeVideoId(youtubeUrl);
  const previewThumbnail = videoId ? getYouTubeThumbnailUrl(videoId) : null;

  const resetForm = () => {
    setYoutubeUrl('');
    setTitle('');
    setDebaters('');
    setDescription('');
    setSubmittedBy('');
    setHoneypot('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId) {
      setErrorMessage('Por favor, insira um link válido do YouTube.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('O título da sugestão é obrigatório.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await onSubmit({
        youtubeUrl: youtubeUrl.trim(),
        title: title.trim(),
        debaters: debaters.trim() || undefined,
        description: description.trim() || undefined,
        submittedBy: submittedBy.trim() || undefined,
        honeypot: honeypot.trim() || undefined
      });

      if (response.success) {
        setSuccessMessage('Sugestão enviada com sucesso! Ela já está disponível para votação.');
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMessage(response.error || 'Falha ao salvar sugestão.');
      }
    } catch {
      setErrorMessage('Erro inesperado de comunicação com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <YouTubeIcon size={20} className="text-red-500" />
          <span>Sugerir Próximo Debate</span>
        </div>
      }
      subtitle="Compartilhe o link do YouTube de um debate para ser analisado pela IA do Argumeta"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot invisível para bots */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={honeypotId}>Não preencha este campo:</label>
          <input
            id={honeypotId}
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* YouTube URL input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-main">
            Link do YouTube <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <YouTubeIcon
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none"
            />
            <input
              type="text"
              required
              value={youtubeUrl}
              onChange={(e) => {
                setYoutubeUrl(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
              className="w-full pl-10 pr-3 py-2 bg-surface-elevated border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* YouTube Video Preview Thumbnail */}
          {previewThumbnail && (
            <div className="mt-2.5 p-2 bg-surface-elevated rounded-xl border border-primary/30 flex items-center gap-3">
              <div className="w-24 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0 relative">
                <img
                  src={previewThumbnail}
                  alt="Prévia do vídeo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Video size={14} className="text-white drop-shadow" />
                </div>
              </div>
              <div className="text-xs">
                <span className="text-primary font-medium flex items-center gap-1">
                  <CheckCircle2 size={13} /> Link reconhecido
                </span>
                <span className="text-text-muted text-[11px] block mt-0.5">
                  ID: {videoId}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Title input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-main">
            Título do Debate <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Debate Eleitoral Municipal 2026 — Rádio Capital"
            className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        {/* Debaters input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-main">
            Debatedores Envolvidos (opcional)
          </label>
          <input
            type="text"
            maxLength={200}
            value={debaters}
            onChange={(e) => setDebaters(e.target.value)}
            placeholder="Ex: Candidato A vs. Candidato B"
            className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        {/* Description input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-main">
            Por que este debate deve ser analisado? (opcional)
          </label>
          <textarea
            rows={3}
            maxLength={800}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Conte brevemente os pontos altos ou o tema de destaque deste embate..."
            className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all"
          />
        </div>

        {/* Submitter Name input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-main">
            Seu Nome ou Apelido (opcional)
          </label>
          <input
            type="text"
            maxLength={60}
            value={submittedBy}
            onChange={(e) => setSubmittedBy(e.target.value)}
            placeholder="Ex: Lucas / Anônimo"
            className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-status-false/10 border border-status-false/30 text-status-false text-xs">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-status-true/10 border border-status-true/30 text-status-true text-xs">
            <CheckCircle2 size={15} className="flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            disabled={!videoId || !title.trim()}
            icon={<Send size={15} />}
          >
            Publicar Sugestão
          </Button>
        </div>
      </form>
    </Modal>
  );
};
