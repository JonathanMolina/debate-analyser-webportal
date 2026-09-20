import { FC } from 'react';
import { Mail, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/Button/Button';

export interface NewsletterBannerProps {
  onOpenNewsletter: () => void;
  title?: string;
  subtitle?: string;
}

export const NewsletterBanner: FC<NewsletterBannerProps> = ({
  onOpenNewsletter,
  title = 'Gostou desta análise imparcial?',
  subtitle = 'Receba em primeira mão no seu WhatsApp ou E-mail os próximos debates, checagens de fatos e alertas de pontuação.'
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-surface-elevated via-surface to-surface-elevated border border-primary/25 rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/40 relative overflow-hidden">
      {/* Detalhe de fundo decorativo */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[11px] font-mono font-bold flex items-center gap-1">
              <MessageCircle size={12} />
              WhatsApp & E-mail
            </span>
            <span className="text-[11px] text-text-muted flex items-center gap-1 font-mono">
              <ShieldCheck size={12} className="text-emerald-400" />
              100% Imparcial
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-text-main tracking-tight">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onOpenNewsletter}
            icon={<Mail size={16} />}
            className="w-full sm:w-auto font-bold cursor-pointer"
          >
            <span>Receber Análises</span>
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
