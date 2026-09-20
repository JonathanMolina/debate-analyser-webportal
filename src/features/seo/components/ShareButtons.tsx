import { FC, useState, useCallback } from 'react';
import { Share2, Check, Copy, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/Button/Button';

export interface ShareButtonsProps {
  title: string;
  url?: string;
  summary?: string;
}

export const ShareButtons: FC<ShareButtonsProps> = ({ title, url, summary }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = summary ? `${title} — ${summary}` : title;

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback se permissão falhar
    }
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl
        });
      } catch {
        // Usuário cancelou
      }
    } else {
      handleCopy();
    }
  }, [title, shareText, shareUrl, handleCopy]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareText}\n\nConfira a análise completa e fact-checking no Argumeta:`);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}&via=Argumeta`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-xs text-text-muted font-medium flex items-center gap-1 mr-1">
        <Share2 size={13} className="text-primary" />
        Compartilhar análise:
      </span>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-emerald-500/20 text-emerald-400 border border-border text-xs font-semibold transition-colors"
        title="Compartilhar no WhatsApp"
        aria-label="Compartilhar no WhatsApp"
      >
        <MessageCircle size={14} />
        <span>WhatsApp</span>
      </a>

      {/* X / Twitter */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-sky-500/20 text-sky-400 border border-border text-xs font-semibold transition-colors"
        title="Compartilhar no X (Twitter)"
        aria-label="Compartilhar no X (Twitter)"
      >
        <span className="font-mono text-xs font-bold">𝕏</span>
        <span>Postar</span>
      </a>

      {/* Telegram */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-blue-500/20 text-blue-400 border border-border text-xs font-semibold transition-colors"
        title="Compartilhar no Telegram"
        aria-label="Compartilhar no Telegram"
      >
        <Send size={13} />
        <span>Telegram</span>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-blue-600/20 text-blue-300 border border-border text-xs font-semibold transition-colors"
        title="Compartilhar no LinkedIn"
        aria-label="Compartilhar no LinkedIn"
      >
        <span className="font-bold text-xs">in</span>
        <span>LinkedIn</span>
      </a>

      {/* Copiar Link */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="text-xs h-8 px-3 rounded-xl border-border"
        title="Copiar link permanente"
      >
        {copied ? (
          <>
            <Check size={13} className="text-emerald-400" />
            <span className="text-emerald-400">Copiado!</span>
          </>
        ) : (
          <>
            <Copy size={13} />
            <span>Copiar link</span>
          </>
        )}
      </Button>

      {/* Compartilhar Nativo (Mobile) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/20 text-primary border border-primary/30 text-xs font-semibold"
        >
          <Share2 size={13} />
          <span>Mais</span>
        </button>
      )}
    </div>
  );
};
