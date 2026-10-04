import { FC } from 'react';
import { Play, Lightbulb } from 'lucide-react';
import type { ProposalItem } from '../types/debate.types';
import { InfoTooltip } from '@/components/InfoTooltip';
import { METRIC_EXPLANATIONS } from '../utils/metricExplanations';

export interface ProposalsListProps {
  proposals?: ProposalItem[];
  onSeek: (seconds: number) => void;
}

export const ProposalsList: FC<ProposalsListProps> = ({
  proposals = [],
  onSeek
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (proposals.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
        Nenhuma proposta ou solução explícita foi mapeada neste debate.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Banner Explicativo Neutro */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-3 text-xs">
        <Lightbulb size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-bold text-text-main">
            <span>Mapeamento de Propostas & Soluções</span>
            <InfoTooltip
              title={METRIC_EXPLANATIONS.proposalsTab.title}
              content={METRIC_EXPLANATIONS.proposalsTab.shortHint}
              iconClassName="text-amber-400 hover:text-amber-300 transition-colors"
              triggerAriaLabel="Informações sobre a aba de propostas"
            />
          </div>
          <p className="text-text-muted text-[11px] leading-relaxed">
            Identificação neutra dos trechos onde cada debatedor sugeriu propostas, ideias práticas ou soluções para problemas. Cada citação de proposta concede +5 pontos na pontuação técnica. Não é emitido juízo de valor sobre o mérito ou viabilidade da proposta.
          </p>
        </div>
      </div>

      {/* Lista de Propostas */}
      {proposals.map((item) => (
        <div
          key={item.id}
          className="p-5 bg-surface border border-border/80 rounded-2xl space-y-3 hover:border-amber-400/40 transition-all shadow-sm"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-text-main">
                {item.speaker}
              </span>
              {item.topic && (
                <>
                  <span className="text-text-muted">•</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono bg-surface-elevated text-text-muted border border-border">
                    {item.topic}
                  </span>
                </>
              )}
              <div className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <span>+5 pts</span>
                <InfoTooltip
                  title={METRIC_EXPLANATIONS.proposalPoints.title}
                  content={METRIC_EXPLANATIONS.proposalPoints.shortHint}
                  iconSize={11}
                  iconClassName="text-amber-400 hover:text-amber-200 transition-colors"
                  triggerAriaLabel="Informações sobre pontuação da proposta"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSeek(item.timestamp)}
              className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-canvas text-primary border border-border hover:border-primary/40 transition-colors cursor-pointer"
            >
              <Play size={10} className="fill-primary" />
              <span>Timestamp: {formatTime(item.timestamp)}</span>
            </button>
          </div>

          {/* Contexto */}
          {item.context && (
            <div className="space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider">
                Contexto do Problema Abordado:
              </span>
              <p className="text-xs text-text-muted leading-relaxed bg-canvas/40 p-3 rounded-xl border border-border/40">
                {item.context}
              </p>
            </div>
          )}

          {/* Trecho com Citação da Proposta */}
          <div className="space-y-1">
            <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider">
              Proposta ou Solução Citada:
            </span>
            <blockquote className="text-sm font-medium text-text-main/90 italic bg-canvas/60 p-3.5 rounded-xl border border-border/40">
              "{item.quote}"
            </blockquote>
          </div>
        </div>
      ))}
    </div>
  );
};
