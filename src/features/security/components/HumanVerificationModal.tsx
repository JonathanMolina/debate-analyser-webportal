import { FC, useState } from 'react';
import { ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/Button/Button';

interface HumanVerificationModalProps {
  isOpen: boolean;
  onVerify: () => void;
}

export const HumanVerificationModal: FC<HumanVerificationModalProps> = ({
  isOpen,
  onVerify
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handleChallenge = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setCompleted(true);
      setTimeout(() => {
        onVerify();
        setCompleted(false);
      }, 600);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-5 text-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
          <ShieldAlert size={24} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-text-main">
            Verificação de Integridade Pública
          </h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Para garantir a estabilidade do portal e proteger os servidores Supabase contra scraping abusivo e requisições automatizadas, confirme que você é humano.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-canvas border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleChallenge}
              disabled={isVerifying || completed}
              className={`w-6 h-6 rounded border transition-all flex items-center justify-center cursor-pointer ${
                completed
                  ? 'bg-primary border-primary text-black'
                  : 'border-border hover:border-primary bg-surface'
              }`}
            >
              {isVerifying ? (
                <RefreshCw size={14} className="text-primary animate-spin" />
              ) : completed ? (
                <CheckCircle2 size={16} />
              ) : null}
            </button>
            <span className="text-sm font-medium text-text-main">
              Não sou um robô
            </span>
          </div>

          <div className="text-[10px] text-text-muted font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Argumeta Shield
          </div>
        </div>

        <div className="text-[11px] text-text-muted">
          Todos os dados desta plataforma são abertos e imparciais.
        </div>
      </div>
    </div>
  );
};
