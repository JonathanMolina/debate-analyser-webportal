import { FC } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Lightbulb, Bug, Heart, HelpCircle } from 'lucide-react';
import { Modal } from '@/components/Modal/Modal';
import { Button } from '@/components/Button/Button';
import { useFeedbackForm } from '../hooks/useFeedbackForm';
import type { FeedbackCategory } from '../types/feedback.types';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const {
    category,
    setCategory,
    message,
    setMessage,
    name,
    setName,
    email,
    setEmail,
    isLoading,
    isSuccess,
    errorMessage,
    handleSubmit,
    resetForm
  } = useFeedbackForm(onClose);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const categories: { id: FeedbackCategory; label: string; icon: typeof Lightbulb }[] = [
    { id: 'suggestion', label: 'Sugestão', icon: Lightbulb },
    { id: 'praise', label: 'Elogio', icon: Heart },
    { id: 'bug', label: 'Erro / Bug', icon: Bug },
    { id: 'other', label: 'Outro', icon: HelpCircle }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-primary" />
          <span>Enviar Feedback para a Equipe</span>
        </div>
      }
      subtitle="Sua opinião é fundamental para aprimorar a imparcialidade e usabilidade do Argumeta."
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto border border-primary/30">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-base font-bold text-text-main">
            Feedback Enviado com Sucesso!
          </h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
            Agradecemos imensamente pela sua contribuição. Nossa equipe avaliará sua mensagem para continuar aprimorando a plataforma.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Categoria */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-main block font-mono">
              Tipo de Feedback
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary/15 border-primary text-primary font-bold shadow-sm'
                        : 'bg-canvas border-border text-text-muted hover:text-text-main hover:bg-surface-hover'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mensagem */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor="feedback-message" className="font-semibold text-text-main">
                Mensagem <span className="text-primary">*</span>
              </label>
              <span className="text-text-muted text-[11px]">{message.length}/3000</span>
            </div>
            <textarea
              id="feedback-message"
              rows={4}
              maxLength={3000}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva sua sugestão de debate, melhoria nas análises ou problema encontrado..."
              className="w-full p-3 bg-canvas border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Nome e E-mail (Opcionais) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="feedback-name" className="text-xs font-semibold text-text-muted block font-mono">
                Seu Nome (Opcional)
              </label>
              <input
                id="feedback-name"
                type="text"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Silva"
                className="w-full h-10 px-3 bg-canvas border border-border rounded-xl text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="feedback-email" className="text-xs font-semibold text-text-muted block font-mono">
                Seu E-mail (Opcional)
              </label>
              <input
                id="feedback-email"
                type="email"
                maxLength={150}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Para resposta da equipe"
                className="w-full h-10 px-3 bg-canvas border border-border rounded-xl text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed">
            Seus dados são transmitidos de forma segura e armazenados privadamente para avaliação exclusiva da nossa equipe.
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
              Enviar Mensagem
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
