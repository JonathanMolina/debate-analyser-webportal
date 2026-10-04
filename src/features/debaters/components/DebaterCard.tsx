import { FC } from 'react';
import { Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { DebaterAvatar } from '@/components/DebaterAvatar';
import { InfoTooltip } from '@/components/InfoTooltip';
import { METRIC_EXPLANATIONS } from '@/features/debates/utils/metricExplanations';
import type { DebaterAggregateStats } from '../types/debater.types';

export interface DebaterCardProps {
  debater: DebaterAggregateStats;
  onViewDetails: (debater: DebaterAggregateStats) => void;
}

export const DebaterCard: FC<DebaterCardProps> = ({
  debater,
  onViewDetails
}) => {
  const hasDebates = debater.debatesCount > 0;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col justify-between gap-5 hover:border-border/90 hover:bg-surface-hover/50 transition-all shadow-sm">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {/* Avatar */}
          <DebaterAvatar
            name={debater.debaterName}
            photoUrl={debater.photoUrl}
            debaterId={debater.debaterId}
            size="lg"
            shape="2xl"
            className="w-14 h-14 border-2 border-border shadow-md"
          />

          {/* Identity Info */}
          <div>
            <h3 className="font-bold text-base text-text-main leading-tight">
              {debater.debaterName}
            </h3>
            {debater.role && (
              <p className="text-xs text-text-muted mt-0.5">{debater.role}</p>
            )}
            <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted font-mono">
              <span>{debater.debatesCount} debates</span>
              {hasDebates && (
                <>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{debater.winRate}% de vitórias</span>
                  <InfoTooltip
                    title={METRIC_EXPLANATIONS.winRate.title}
                    content={METRIC_EXPLANATIONS.winRate.shortHint}
                    triggerAriaLabel={`Taxa de vitórias de ${debater.debaterName}`}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Big Score Tag */}
        <div className="text-right font-mono shrink-0">
          <div className="flex items-center justify-end gap-1">
            <span className="text-[10px] text-text-muted uppercase">Média Técnica</span>
            <InfoTooltip
              title={METRIC_EXPLANATIONS.technicalAverage.title}
              content={METRIC_EXPLANATIONS.technicalAverage.shortHint}
              triggerAriaLabel={`Média técnica de ${debater.debaterName}`}
            />
          </div>
          <span className="text-xl font-black text-primary block leading-none mt-0.5">
            {hasDebates ? debater.avgScore : '-'}
          </span>
          <span className="text-[9px] text-text-muted block">
            {hasDebates ? 'pontos' : 'sem debates'}
          </span>
        </div>
      </div>

      {/* Metrics Row (4 indicators) */}
      {hasDebates ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-canvas/60 p-3 rounded-xl border border-border/60 text-center font-mono">
          <div>
            <span className="text-[10px] text-text-muted flex items-center justify-center gap-0.5">
              <span>Dados/Fatos</span>
              <InfoTooltip
                title={METRIC_EXPLANATIONS.dataDensity.title}
                content={METRIC_EXPLANATIONS.dataDensity.shortHint}
              />
            </span>
            <span className="text-xs font-bold text-text-main">{debater.avgDataDensity}/100</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted flex items-center justify-center gap-0.5">
              <span>Compostura</span>
              <InfoTooltip
                title={METRIC_EXPLANATIONS.emotionalControl.title}
                content={METRIC_EXPLANATIONS.emotionalControl.shortHint}
              />
            </span>
            <span className="text-xs font-bold text-text-main">{debater.avgEmotionalControl}/100</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted flex items-center justify-center gap-0.5">
              <span>Falácias/Deb</span>
              <InfoTooltip
                title={METRIC_EXPLANATIONS.fallaciesPerDebate.title}
                content={METRIC_EXPLANATIONS.fallaciesPerDebate.shortHint}
              />
            </span>
            <span className="text-xs font-bold text-rose-400">{debater.avgFallaciesPerDebate}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted flex items-center justify-center gap-0.5">
              <span>Propostas/Deb</span>
              <InfoTooltip
                title={METRIC_EXPLANATIONS.proposalsPerDebate.title}
                content={METRIC_EXPLANATIONS.proposalsPerDebate.shortHint}
              />
            </span>
            <span className="text-xs font-bold text-amber-400">{debater.avgProposalsPerDebate ?? 0}</span>
          </div>
        </div>
      ) : (
        <div className="bg-canvas/60 p-3 rounded-xl border border-border/60 text-center text-xs text-text-muted">
          Aguardando análise de debates deste participante na plataforma.
        </div>
      )}

      {/* Latest Debate Pill */}
      {hasDebates && debater.recentDebates[0] ? (
        <div className="text-xs space-y-1 bg-surface-elevated/40 p-2.5 rounded-xl border border-border/60">
          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span className="flex items-center gap-1 font-mono">
              <Video size={11} className="text-primary" />
              Último debate:
            </span>
            <span
              className={`font-bold font-mono text-[10px] px-1.5 py-0.2 rounded ${
                debater.recentDebates[0].result === 'win'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : debater.recentDebates[0].result === 'loss'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {debater.recentDebates[0].result === 'win'
                ? 'VITÓRIA'
                : debater.recentDebates[0].result === 'loss'
                ? 'DERROTA'
                : 'EMPATE'}
            </span>
          </div>
          <div className="text-xs font-semibold text-text-main truncate">
            {debater.recentDebates[0].debateTitle ||
              `Vs ${debater.recentDebates[0].opponentNames.join(', ')}`}
          </div>
        </div>
      ) : null}

      {/* Action */}
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-center gap-1.5 text-xs group/btn"
        onClick={() => onViewDetails(debater)}
      >
        <span>Ver Dossiê Completo</span>
        <ArrowRight
          size={14}
          className="group-hover/btn:translate-x-0.5 transition-transform"
        />
      </Button>
    </div>
  );
};
