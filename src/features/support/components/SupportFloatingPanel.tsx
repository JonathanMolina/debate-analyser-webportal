import { FC, useState } from 'react';
import { Heart, QrCode, Copy, Check, ChevronDown, ChevronUp, Sparkles, Maximize2, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getPixConfig } from '../utils/pix';

export const SupportFloatingPanel: FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('argumeta_support_collapsed');
      return saved !== 'true'; // Aberto inicialmente se o usuário não colapsou antes
    }
    return true;
  });

  const [copiedType, setCopiedType] = useState<'payload' | 'key' | null>(null);
  const [isQrZoomed, setIsQrZoomed] = useState(false);
  const [showFullPayload, setShowFullPayload] = useState(false);

  const pixConfig = getPixConfig();

  const handleToggle = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('argumeta_support_collapsed', String(!next));
      }
      return next;
    });
  };

  const handleCopyText = (text: string, type: 'payload' | 'key') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  return (
    <>
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
                    Acesso Livre • Sem Recursos Pagos
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
                Todas as consultas, métricas e rankings do <strong>Argumeta</strong> possuem <strong className="text-text-main">acesso livre e irrestrito</strong>. Não possuímos assinaturas pagas nem paywalls.
              </p>
              <p>
                O processamento de vídeos longos, diarização de áudio e inteligência artificial demanda servidores e GPUs dedicadas de alto custo. Se este projeto agrega valor ao seu dia a dia, <strong className="text-text-main">agradecemos de coração qualquer quantia doada</strong> para manter a plataforma no ar e viabilizar a análise de cada vez mais debates.
              </p>
            </div>

            {/* Seção Pix Dinâmico com QR Code */}
            <div className="bg-canvas border border-border p-3.5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3.5">
                {/* Moldura do QR Code gerado dinamicamente */}
                <button
                  type="button"
                  onClick={() => setIsQrZoomed(true)}
                  className="bg-white p-2 rounded-xl border-2 border-emerald-500/20 shrink-0 relative group cursor-pointer hover:border-primary transition-all shadow-md"
                  title="Clique para ampliar o QR Code"
                >
                  <QRCodeSVG
                    value={pixConfig.payload}
                    size={84}
                    level="M"
                    includeMargin={false}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                  <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                    <Maximize2 size={16} />
                    <span className="text-[8px] font-bold mt-0.5">Ampliar</span>
                  </div>
                </button>

                {/* Chave e Ações de Cópia */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div>
                    <span className="text-[11px] font-bold text-text-main block">
                      Chave Pix:
                    </span>
                    <p className="text-[10px] text-text-muted font-mono truncate bg-surface px-2 py-1 rounded-lg border border-border/80 select-all">
                      {pixConfig.key}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-1.5">
                    {/* Botão Copiar Pix Copia e Cola */}
                    <button
                      type="button"
                      onClick={() => handleCopyText(pixConfig.payload, 'payload')}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-primary hover:bg-primary-hover text-surface text-[11px] font-bold transition-all cursor-pointer shadow-sm"
                      title="Copiar código Pix Copia e Cola para colar no aplicativo do seu banco"
                    >
                      {copiedType === 'payload' ? (
                        <>
                          <Check size={13} />
                          <span>Copia e Cola Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Pix Copia e Cola</span>
                        </>
                      )}
                    </button>

                    {/* Botão Copiar Chave Simples */}
                    <button
                      type="button"
                      onClick={() => handleCopyText(pixConfig.key, 'key')}
                      className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-text-main text-[11px] font-medium border border-border transition-all cursor-pointer"
                      title="Copiar chave direta"
                    >
                      {copiedType === 'key' ? (
                        <>
                          <Check size={12} className="text-primary" />
                          <span className="text-primary font-bold">Copiada!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} className="text-text-muted" />
                          <span>Chave</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão para exibir código completo e seleção manual de texto */}
              <div className="pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowFullPayload(!showFullPayload)}
                  className="text-[10px] text-text-muted hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-mono"
                >
                  <QrCode size={12} />
                  <span>{showFullPayload ? 'Ocultar texto do código' : 'Ver / selecionar texto completo'}</span>
                </button>

                {showFullPayload && (
                  <div className="mt-2 space-y-1.5 animate-fadeIn">
                    <label htmlFor="pix-copia-cola-text" className="text-[10px] text-text-muted block font-mono">
                      Texto do Pix Copia e Cola (selecionável):
                    </label>
                    <textarea
                      id="pix-copia-cola-text"
                      readOnly
                      value={pixConfig.payload}
                      rows={3}
                      className="w-full text-[10px] font-mono p-2 bg-surface rounded-lg border border-border/80 text-text-muted focus:outline-none select-all resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé com Agradecimento */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-emerald-400 font-mono">
              <span className="flex items-center gap-1">
                <Sparkles size={13} className="text-primary" />
                Muito obrigado pelo seu apoio!
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

      {/* Modal de Zoom do QR Code */}
      {isQrZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pix-modal-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsQrZoomed(false)}
        >
          <div
            className="bg-surface border-2 border-emerald-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsQrZoomed(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-text-muted hover:text-text-main hover:bg-surface-hover cursor-pointer transition-colors"
              title="Fechar"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 id="pix-modal-title" className="text-base font-bold text-text-main">
                Escanear QR Code Pix
              </h3>
              <p className="text-xs text-text-muted">
                Abra o aplicativo do seu banco, escolha <strong>Pix</strong> e aponte a câmera.
              </p>
            </div>

            <div className="inline-block bg-white p-4 rounded-2xl border-2 border-emerald-500/30 shadow-lg mx-auto">
              <QRCodeSVG
                value={pixConfig.payload}
                size={210}
                level="Q"
                includeMargin={false}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs text-text-muted font-mono bg-canvas py-1.5 px-3 rounded-xl border border-border select-all">
                {pixConfig.key}
              </p>
              <button
                type="button"
                onClick={() => handleCopyText(pixConfig.payload, 'payload')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                {copiedType === 'payload' ? (
                  <>
                    <Check size={14} />
                    <span>Pix Copia e Cola Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copiar Pix Copia e Cola</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
