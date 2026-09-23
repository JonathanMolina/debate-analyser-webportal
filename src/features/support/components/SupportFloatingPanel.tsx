import { FC, useState, useEffect } from 'react';
import { Heart, Copy, Check, ChevronDown, ChevronUp, Sparkles, Maximize2, X, ExternalLink, CreditCard } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getPaymentConfig } from '../utils/payment';

export const SupportFloatingPanel: FC = () => {
  // Inicia colapsado e expande automaticamente após 10 segundos
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [isQrZoomed, setIsQrZoomed] = useState<boolean>(false);

  const paymentConfig = getPaymentConfig();

  // Exibir popup automaticamente para PC e smartphone após 10 segundos na página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCopyLink = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    }
  };

  return (
    <>
      <aside
        aria-label="Apoie a Plataforma Argumeta"
        className={
          isExpanded
            ? 'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 max-w-sm z-40 select-none transition-all duration-300 animate-fadeIn'
            : 'fixed bottom-4 right-4 z-40 select-none animate-fadeIn'
        }
      >
        {isExpanded ? (
          /* Painel Expandido */
          <div className="bg-surface border-2 border-emerald-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/80 backdrop-blur-md space-y-3.5 relative overflow-hidden max-w-full">
            {/* Efeito sutil de iluminação */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <Heart size={16} className="fill-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-xs sm:text-sm text-text-main flex items-center gap-1.5 leading-tight truncate">
                    Apoie a Plataforma Argumeta
                  </h3>
                  <span className="text-[10px] text-text-muted font-mono block truncate">
                    Acesso Livre • Sem Recursos Pagos
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggle}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-hover cursor-pointer transition-colors shrink-0"
                title="Minimizar painel de apoio"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Mensagem Institucional */}
            <div className="space-y-1.5 text-xs text-text-muted leading-relaxed">
              <p>
                Todas as consultas e métricas do <strong>Argumeta</strong> têm <strong className="text-text-main">acesso livre</strong>. Não possuímos paywalls.
              </p>
              <p className="text-[11px] sm:text-xs">
                O processamento por IA demanda servidores dedicados de alto custo. Se a plataforma agrega valor para você, <strong className="text-text-main">agradecemos qualquer doação</strong> para mantê-la no ar!
              </p>
            </div>

            {/* Seção Link de Pagamento Mercado Pago com QR Code */}
            <div className="bg-canvas border border-border p-3 sm:p-3.5 rounded-2xl space-y-2.5 max-w-full overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span className="font-semibold text-text-main flex items-center gap-1 truncate">
                  <CreditCard size={13} className="text-primary shrink-0" />
                  <span>Mercado Pago (Pix, Cartão, Boleto)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono shrink-0 ml-1">Seguro</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Moldura do QR Code gerado para o link */}
                <button
                  type="button"
                  onClick={() => setIsQrZoomed(true)}
                  className="bg-white p-1.5 sm:p-2 rounded-xl border-2 border-emerald-500/20 shrink-0 relative group cursor-pointer hover:border-primary transition-all shadow-md"
                  title="Clique para ampliar o QR Code do link de pagamento"
                >
                  <QRCodeSVG
                    value={paymentConfig.paymentUrl}
                    size={76}
                    level="M"
                    includeMargin={false}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                  <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                    <Maximize2 size={14} />
                    <span className="text-[7px] font-bold mt-0.5">Ampliar</span>
                  </div>
                </button>

                {/* Informações do Link e Ações */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-text-main block">
                      Link de Pagamento:
                    </span>
                    <p
                      title={paymentConfig.paymentUrl}
                      className="text-[10px] text-text-muted font-mono truncate bg-surface px-2 py-1 rounded-lg border border-border/80 select-all"
                    >
                      {paymentConfig.displayUrl}
                    </p>
                  </div>

                  <div className="flex gap-1.5">
                    {/* Botão Ir ao Link (Abre nova aba) */}
                    <a
                      href={paymentConfig.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-primary hover:bg-primary-hover text-surface text-[11px] font-bold transition-all cursor-pointer shadow-sm text-center truncate"
                      title="Ir para o link de pagamento do Mercado Pago"
                    >
                      <span>Abrir</span>
                      <ExternalLink size={12} className="shrink-0" />
                    </a>

                    {/* Botão Copiar Link */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(paymentConfig.paymentUrl)}
                      className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-text-main text-[11px] font-medium border border-border transition-all cursor-pointer shrink-0"
                      title="Copiar link de pagamento"
                    >
                      {hasCopied ? (
                        <>
                          <Check size={12} className="text-primary" />
                          <span className="text-primary font-bold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} className="text-text-muted" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-text-muted leading-tight">
                Aponte a câmera para ler o QR Code ou clique em <strong>Abrir</strong> para doar via Pix, Cartão ou Boleto.
              </p>
            </div>

            {/* Rodapé com Agradecimento */}
            <div className="flex items-center justify-between pt-0.5 text-[11px] text-emerald-400 font-mono">
              <span className="flex items-center gap-1 truncate">
                <Sparkles size={12} className="text-primary shrink-0" />
                <span>Obrigado pelo seu apoio!</span>
              </span>
              <button
                type="button"
                onClick={handleToggle}
                className="text-text-muted hover:text-text-main underline cursor-pointer text-[10px] shrink-0 ml-2"
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
            className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 rounded-full bg-surface border-2 border-primary/40 text-text-main hover:border-primary hover:bg-surface-hover shadow-xl hover:shadow-primary/20 transition-all cursor-pointer group"
            title="Abrir painel de apoio e doações"
          >
            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Heart size={12} className="fill-primary" />
            </div>
            <span className="text-xs font-bold text-text-main whitespace-nowrap">
              Apoiar o Argumeta
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/15 text-primary font-semibold shrink-0">
              Pix • Cartão
            </span>
            <ChevronUp size={14} className="text-text-muted group-hover:text-primary transition-colors shrink-0" />
          </button>
        )}
      </aside>

      {/* Modal de Zoom do QR Code */}
      {isQrZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-modal-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsQrZoomed(false)}
        >
          <div
            className="bg-surface border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-6 max-w-xs sm:max-w-sm w-full shadow-2xl space-y-4 text-center relative max-h-[90vh] overflow-y-auto"
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
              <h3 id="payment-modal-title" className="text-base font-bold text-text-main">
                Escanear Link de Pagamento
              </h3>
              <p className="text-xs text-text-muted">
                Aponte a câmera do seu celular para abrir o link do Mercado Pago e pagar via <strong>Pix, Cartão ou Boleto</strong>.
              </p>
            </div>

            <div className="inline-block bg-white p-3 sm:p-4 rounded-2xl border-2 border-emerald-500/30 shadow-lg mx-auto">
              <QRCodeSVG
                value={paymentConfig.paymentUrl}
                size={190}
                level="Q"
                includeMargin={false}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-xs text-text-muted font-mono bg-canvas py-1.5 px-3 rounded-xl border border-border select-all truncate">
                {paymentConfig.displayUrl}
              </p>

              <div className="flex gap-2">
                <a
                  href={paymentConfig.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold transition-all cursor-pointer shadow-md text-center"
                >
                  <span>Abrir no Navegador</span>
                  <ExternalLink size={13} />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyLink(paymentConfig.paymentUrl)}
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-surface-elevated hover:bg-surface-hover text-text-main text-xs font-medium border border-border transition-all cursor-pointer shrink-0"
                  title="Copiar link"
                >
                  {hasCopied ? (
                    <>
                      <Check size={13} className="text-primary" />
                      <span className="text-primary font-bold">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} className="text-text-muted" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
