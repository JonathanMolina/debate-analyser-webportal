import { FC, useState, useEffect } from 'react';
import { Heart, X, QrCode, Copy, Check, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/Button/Button';

export const SupportFloatingPanel: FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('argumeta_support_collapsed');
      return saved !== 'true'; // Aberto inicialmente se o usuário não colapsou antes
    }
    return true;
  });

  const [copied, setCopied] = useState(false);

  // Chave Pix padrão / placeholder editável
  const pixKey = 'pix@argumeta.com.br';

  const handleToggle = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('argumeta_support_collapsed', String(!next));
      }
      return next;
    });
  };

  const handleCopyPix = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside
      aria-label="Apoie a Plataforma Argumeta"
      className="fixed bottom-4 right-4 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] select-none transition-all duration-300 animate-fadeIn"
    >
      {isExpanded ? (
        /* Painel Expandido */
        <div className="bg-surface border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80 backdrop-blur-md space-y-4 relative overflow-hidden">
          {/* Efeito sutil de iluminação */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <Heart size={18} className="fill-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-text-main flex items-center gap-1.5 leading-tight">
                  Apoie a Plataforma Argumeta
                </h3>
                <span className="text-[10px] text-text-muted font-mono">
                  100% Pública • Sem Recursos Pagos
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-hover cursor-pointer transition-colors"
              title="Minimizar painel de apoio"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Mensagem Institucional */}
          <div className="space-y-2 text-xs text-text-muted leading-relaxed">
            <p>
              Todos os relatórios, checagens e rankings do <strong>Argumeta</strong> são <strong className="text-text-main">totalmente públicos e abertos</strong>. Não possuímos assinaturas pagas nem paywalls.
            </p>
            <p>
              O processamento de vídeos longos, diarização de áudio e inteligência artificial demanda servidores e GPUs dedicadas de alto custo. Se este projeto agrega valor ao seu dia a dia, <strong className="text-text-main">agradecemos de coração qualquer quantia doada</strong> para manter a plataforma no ar e viabilizar a auditoria de cada vez mais debates.
            </p>
          </div>

          {/* Seção Pix e QR Code Placeholder */}
          <div className="bg-canvas border border-border p-3.5 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              {/* Moldura do QR Code */}
              <div className="w-20 h-20 bg-surface-elevated border border-border rounded-xl flex flex-col items-center justify-center text-text-muted p-2 shrink-0 relative overflow-hidden group">
                <QrCode size={36} className="text-primary/70 group-hover:scale-105 transition-transform" />
                <span className="text-[8px] font-mono text-center text-text-muted/80 mt-1">
                  QR Code Pix
                </span>
              </div>

              {/* Instruções e Chave */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <span className="text-[11px] font-bold text-text-main block">
                  Doe via Pix:
                </span>
                <p className="text-[10px] text-text-muted font-mono truncate bg-surface px-2 py-1 rounded-lg border border-border/80">
                  {pixKey}
                </p>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="w-full flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary text-[11px] font-semibold border border-primary/30 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={12} />
                      <span>Chave Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copiar Chave Pix</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Rodapé com Agradecimento */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-emerald-400 font-mono">
            <span className="flex items-center gap-1">
              <Sparkles size={13} className="text-primary" />
              Muito obrigado pelo apoio cívico!
            </span>
            <button
              type="button"
              onClick={handleToggle}
              className="text-text-muted hover:text-text-main underline cursor-pointer text-[10px]"
            >
              Minimizar
            </button>
          </div>
        </div>
      ) : (
        /* Botão / Pílula Flutuante Colapsada */
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-surface border-2 border-primary/40 text-text-main hover:border-primary hover:bg-surface-hover shadow-xl hover:shadow-primary/20 transition-all cursor-pointer group"
          title="Abrir painel de apoio e doações"
        >
          <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart size={12} className="fill-primary" />
          </div>
          <span className="text-xs font-bold text-text-main">
            Apoiar o Argumeta
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/15 text-primary font-semibold">
            PIX
          </span>
          <ChevronUp size={14} className="text-text-muted group-hover:text-primary transition-colors" />
        </button>
      )}
    </aside>
  );
};
