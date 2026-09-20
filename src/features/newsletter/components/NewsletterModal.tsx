import { FC } from 'react';
import {
  Mail,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send
} from 'lucide-react';
import { Modal } from '@/components/Modal/Modal';
import { Button } from '@/components/Button/Button';
import { useNewsletterForm } from '../hooks/useNewsletterForm';
import type { NewsletterContactType } from '../types/newsletter.types';

export interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDebate?: {
    id: string;
    title: string;
  };
}

export const NewsletterModal: FC<NewsletterModalProps> = ({
  isOpen,
  onClose,
  currentDebate
}) => {
  const {
    contactType,
    setContactType,
    email,
    setEmail,
    whatsapp,
    setWhatsapp,
    name,
    setName,
    isLoading,
    isSuccess,
    errorMessage,
    viewedDebates,
    handleSubmit,
    resetForm
  } = useNewsletterForm({ currentDebate });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const channelOptions: {
    id: NewsletterContactType;
    label: string;
    icon: typeof MessageCircle;
    desc: string;
  }[] = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      desc: 'Mais rápido e direto'
    },
    {
      id: 'email',
      label: 'E-mail',
      icon: Mail,
      desc: 'Boletim completo'
    },
    {
      id: 'both',
      label: 'Ambos',
      icon: Sparkles,
      desc: 'Máxima comodidade'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <Mail size={18} className="text-primary" />
          <span>Receber Novas Análises & Debates</span>
        </div>
      }
      subtitle="Receba checagens de fatos e alertas de novos debates imparciais direto no seu WhatsApp ou E-mail."
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto border border-primary/30">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text-main">
              Inscrição Confirmada com Sucesso!
            </h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
              Pronto! Assim que um novo debate for analisado e processado pela nossa IA, você será um dos primeiros a receber a síntese imparcial.
            </p>
          </div>
          <div className="pt-3">
            <Button variant="primary" size="sm" onClick={handleClose}>
              Entendi, obrigado!
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Opção de Canal: WhatsApp, Email ou Ambos */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-main block font-mono">
              Onde prefere receber as novidades?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {channelOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = contactType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setContactType(opt.id)}
                    className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary/15 border-primary text-primary font-bold shadow-sm'
                        : 'bg-canvas border-border text-text-muted hover:text-text-main hover:bg-surface-hover'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-xs font-semibold">{opt.label}</span>
                    <span className="text-[10px] text-text-muted leading-none hidden sm:inline">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo Nome (Opcional) */}
          <div className="space-y-1">
            <label
              htmlFor="newsletter-name"
              className="text-xs font-semibold text-text-muted block font-mono"
            >
              Seu Nome (Opcional)
            </label>
            <input
              id="newsletter-name"
              type="text"
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ana Souza"
              className="w-full h-10 px-3 bg-canvas border border-border rounded-xl text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          {/* Campo WhatsApp */}
          {(contactType === 'whatsapp' || contactType === 'both') && (
            <div className="space-y-1 animate-fadeIn">
              <label
                htmlFor="newsletter-whatsapp"
                className="text-xs font-semibold text-text-main flex items-center justify-between font-mono"
              >
                <span>
                  Número de WhatsApp <span className="text-primary">*</span>
                </span>
                <span className="text-[10px] text-text-muted">Com DDD ou +DDI</span>
              </label>
              <div className="relative">
                <input
                  id="newsletter-whatsapp"
                  type="tel"
                  required={contactType === 'whatsapp' || contactType === 'both'}
                  maxLength={25}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full h-10 px-3 bg-canvas border border-border rounded-xl text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Campo E-mail */}
          {(contactType === 'email' || contactType === 'both') && (
            <div className="space-y-1 animate-fadeIn">
              <label
                htmlFor="newsletter-email"
                className="text-xs font-semibold text-text-main flex items-center justify-between font-mono"
              >
                <span>
                  Endereço de E-mail <span className="text-primary">*</span>
                </span>
                <span className="text-[10px] text-text-muted">Sem spam</span>
              </label>
              <input
                id="newsletter-email"
                type="email"
                required={contactType === 'email' || contactType === 'both'}
                maxLength={150}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full h-10 px-3 bg-canvas border border-border rounded-xl text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {/* Metadados de Debates Vistos */}
          {(viewedDebates.length > 0 || currentDebate) && (
            <div className="p-3 bg-surface-elevated/80 border border-border rounded-xl space-y-1 text-xs text-text-muted">
              <div className="flex items-center gap-1.5 text-text-main font-medium">
                <Eye size={13} className="text-primary" />
                <span>Interesses rastreados automaticamente:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {currentDebate ? (
                  <>
                    Você está acompanhando{' '}
                    <strong className="text-text-main">
                      "{currentDebate.title}"
                    </strong>
                    {viewedDebates.length > 1 && (
                      <> e outros {viewedDebates.length - 1} debates recentes</>
                    )}
                    . Enviaremos análises pertinentes a estes debatedores e temas.
                  </>
                ) : (
                  <>
                    Detectamos seu interesse em{' '}
                    <strong className="text-text-main">
                      {viewedDebates.length} debate(s)
                    </strong>{' '}
                    analisados anteriormente na plataforma.
                  </>
                )}
              </p>
            </div>
          )}

          <p className="text-[11px] text-text-muted leading-relaxed">
            Seus dados são 100% confidenciais e protegidos. Você poderá cancelar o recebimento a qualquer instante respondendo à mensagem.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              icon={<Send size={13} />}
            >
              Confirmar Inscrição
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
