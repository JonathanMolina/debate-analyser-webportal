import { FC } from 'react';
import { Scale, Database, Cpu, MessageSquare } from 'lucide-react';

export interface FooterProps {
  onOpenFeedback?: () => void;
}

export const Footer: FC<FooterProps> = ({ onOpenFeedback }) => {
  return (
    <footer className="w-full bg-surface border-t border-border mt-16 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Integrity statement */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
              Δ
            </div>
            <span className="font-bold text-text-main text-sm">
              Argumeta — Portal Público Aberto
            </span>
          </div>
          <p className="text-xs text-text-muted max-w-md leading-relaxed">
            Plataforma pública e independente de auditoria algorítmica de debates audiovisuais.
            Métricas de precisão factual, compostura retórica e densidade de dados computadas via inteligência artificial sem curadoria manual.
          </p>
        </div>

        {/* Security & System badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-text-muted font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas border border-border">
            <Scale size={13} className="text-primary" />
            <span>100% Imparcial</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas border border-border">
            <Database size={13} className="text-emerald-400" />
            <span>Supabase RLS Protegido</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas border border-border">
            <Cpu size={13} className="text-yellow-400" />
            <span>Pipeline Whisper + Gemini</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-text-muted">
        <div>
          © {new Date().getFullYear()} Argumeta. Dados públicos abertos sob licença de auditoria cívica.
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="hover:text-text-main transition-colors">Transparência Algorítmica</span>
          <span>•</span>
          <span className="hover:text-text-main transition-colors">Sem Autenticação Obrigatória</span>
          <span>•</span>
          {onOpenFeedback && (
            <>
              <button
                type="button"
                onClick={onOpenFeedback}
                className="text-primary hover:text-primary-hover transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <MessageSquare size={11} />
                <span>Enviar Feedback</span>
              </button>
              <span>•</span>
            </>
          )}
          <span className="hover:text-text-main transition-colors">Proteção Anti-Scraping</span>
        </div>
      </div>
    </footer>
  );
};
