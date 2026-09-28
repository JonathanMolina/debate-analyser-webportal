import { FC } from 'react';
import { Link } from 'react-router';
import { Trophy, ChevronRight, Users } from 'lucide-react';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';
import { DebaterAvatar } from '@/components/DebaterAvatar';
import { InfoTooltip } from '@/components/InfoTooltip';
import { METRIC_EXPLANATIONS } from '@/features/debates/utils/metricExplanations';
import { formatMatchRecordFull } from '@/features/debates/utils/metricFormatters';

export interface TopDebatersPanelProps {
  topDebaters: DebaterAggregateStats[];
  selectedDebater?: string;
  onSelectDebater: (debaterId: string) => void;
}

export const TopDebatersPanel: FC<TopDebatersPanelProps> = ({
  topDebaters,
  selectedDebater,
  onSelectDebater
}) => {
  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-amber-400 text-black border-amber-300 shadow-sm shadow-amber-500/20';
      case 1:
        return 'bg-slate-300 text-black border-slate-200';
      case 2:
        return 'bg-amber-700 text-white border-amber-600';
      default:
        return 'bg-surface-elevated text-text-muted border-border';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-primary" />
          <h2 className="text-sm font-bold text-text-main">
            Top Debatedores
          </h2>
          <InfoTooltip
            title="Classificação dos Top Debatedores"
            content="Debatedores com as maiores médias técnicas consolidadas a partir dos debates analisados."
          />
        </div>
        <Link
          to="/ranking"
          className="text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors"
        >
          <span>Ver ranking</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* List */}
      {topDebaters.length === 0 ? (
        <div className="p-6 text-center text-xs text-text-muted bg-canvas rounded-xl border border-border space-y-1.5">
          <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center mx-auto text-text-muted">
            <Users size={16} />
          </div>
          <p className="font-semibold text-text-main">Nenhum debatedor registrado</p>
          <p className="text-[11px] leading-relaxed">
            Novos debatedores avaliados aparecerão aqui automaticamente.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topDebaters.slice(0, 10).map((debater, index) => {
            const isSelected =
              selectedDebater === debater.debaterId ||
              selectedDebater === debater.debaterName;
            const hasDebates = debater.debatesCount > 0;

            return (
              <div
                key={debater.debaterId}
                onClick={() =>
                  onSelectDebater(isSelected ? '' : debater.debaterName)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectDebater(isSelected ? '' : debater.debaterName);
                  }
                }}
                className={`w-full p-3.5 sm:p-4 rounded-2xl transition-all text-left cursor-pointer border flex flex-col gap-2.5 ${
                  isSelected
                    ? 'bg-primary/15 border-primary/50 shadow-md ring-1 ring-primary/30'
                    : 'bg-canvas/70 hover:bg-surface-hover border-border/80 hover:border-border'
                }`}
              >
                {/* Linha Superior: Posição, Avatar, Nome e Pontuação */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 border ${getRankBadge(
                        index
                      )}`}
                    >
                      {index + 1}º
                    </div>

                    {/* Avatar */}
                    <DebaterAvatar
                      name={debater.debaterName}
                      photoUrl={debater.photoUrl}
                      debaterId={debater.debaterId}
                      size="md"
                      className="w-10 h-10 shrink-0"
                    />

                    {/* Identidade */}
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-text-main truncate leading-tight">
                        {debater.debaterName}
                      </div>
                      <div className="text-[11px] text-text-muted mt-0.5 truncate">
                        {debater.role ? debater.role : `${debater.debatesCount} debates processados`}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0 pl-2 font-mono">
                    <span className="text-base font-black text-primary block leading-tight">
                      {hasDebates ? `${debater.avgScore}` : '-'}
                    </span>
                    <span className="text-[10px] text-text-muted block">
                      {hasDebates ? 'pontos' : 'pendente'}
                    </span>
                  </div>
                </div>

                {/* Linha Inferior: Histórico de Resultados Espaçoso e Tag de Vitórias */}
                <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {hasDebates ? (
                    <>
                      <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-text-muted">
                        <span className="font-medium text-text-main">
                          {formatMatchRecordFull(debater.wins, debater.draws, debater.losses)}
                        </span>
                        <InfoTooltip
                          title={METRIC_EXPLANATIONS.matchRecord.title}
                          content={`${debater.wins} vitórias, ${debater.draws} empates e ${debater.losses} derrotas nos debates analisados.`}
                          triggerAriaLabel={`Histórico de resultados de ${debater.debaterName}`}
                        />
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                        {debater.winRate}% de vitórias
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-text-muted italic">
                      Aguardando debates avaliados
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
