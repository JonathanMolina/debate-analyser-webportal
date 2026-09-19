import { FC, useState } from 'react';
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Scale } from 'lucide-react';

export const DisclaimerBanner: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section aria-label="Aviso de Imparcialidade" className="bg-gradient-to-r from-surface to-surface-elevated border border-emerald-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary mt-0.5">
            <Scale size={20} />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-text-main flex items-center gap-1.5">
                Análise Algorítmica & Imparcialidade Irrestrita
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Algorítmico
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <AlertTriangle size={10} /> IA sujeita a imprecisões
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed max-w-4xl">
              O <strong>Argumeta</strong> opera com independência e neutralidade técnica. Todos os dados, pontuações, detecções de falácias e checagens factuais são gerados por modelos avançados de inteligência artificial. 
              <strong> Não há interferência ou alteração manual de dados e estatísticas por humanos.</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1 cursor-pointer shrink-0 py-1 px-2 rounded-lg hover:bg-primary/10 transition-all self-end sm:self-center"
        >
          <span>{isExpanded ? 'Menos detalhes' : 'Critérios éticos'}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-text-muted animate-fadeIn">
          <div className="bg-canvas/60 p-3 rounded-xl border border-border/60 space-y-1">
            <div className="font-semibold text-text-main flex items-center gap-1.5 text-[11px]">
              <AlertTriangle size={13} className="text-amber-400" />
              <span>Limitações dos Modelos de IA</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Modelos de linguagem podem cometer erros de interpretação em contextos irônicos, gírias regionais ou ruídos fonéticos. Consulte sempre as evidências e trechos de vídeo.
            </p>
          </div>

          <div className="bg-canvas/60 p-3 rounded-xl border border-border/60 space-y-1">
            <div className="font-semibold text-text-main flex items-center gap-1.5 text-[11px]">
              <Scale size={13} className="text-primary" />
              <span>Neutralidade de Critérios</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              As métricas utilizam pesos universais baseados no modelo de argumentação de Toulmin, densidade de dados objetivos e índice de compostura emocional, independentemente do viés ideológico.
            </p>
          </div>

          <div className="bg-canvas/60 p-3 rounded-xl border border-border/60 space-y-1">
            <div className="font-semibold text-text-main flex items-center gap-1.5 text-[11px]">
              <ShieldCheck size={13} className="text-primary" />
              <span>Integridade dos Registros</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              O banco de dados é protegido por políticas RLS estritas de integridade, impossibilitando adulteração externa ou favorecimento de qualquer debatedor.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
