import { FC } from 'react';
import { Link } from 'react-router';
import { Trophy, ChevronRight, Users } from 'lucide-react';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';
import { DebaterAvatar } from '@/components/DebaterAvatar';
import { InfoTooltip } from '@/components/InfoTooltip';
import { METRIC_EXPLANATIONS } from '@/features/debates/utils/metricExplanations';

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
        <div className="space-y-2">
          {topDebaters.slice(0, 10).map((debater, index) => {
            const isSelected =
              selectedDebater === debater.debaterId ||
              selectedDebater === debater.debaterName;

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
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-primary/15 border border-primary/40 text-primary'
                    : 'hover:bg-surface-hover border border-transparent text-text-muted hover:text-text-main'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Number */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold shrink-0 border ${getRankBadge(
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
                    size="sm"
                    className="w-8 h-8 shrink-0"
                  />

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-text-main truncate">
                      {debater.debaterName}
                    </div>
                    <div className="text-[10px] text-text-muted flex items-center gap-1">
                      {debater.debatesCount > 0 ? (
                        <>
                          <span className="truncate">
                            {debater.wins} vit. • {debater.draws} emp. • {debater.losses} der. ({debater.winRate}% vitórias)
                          </span>
                          <InfoTooltip
                            title={METRIC_EXPLANATIONS.matchRecord.title}
                            content={`${debater.wins} vitórias, ${debater.draws} empates e ${debater.losses} derrotas. Aproveitamento de ${debater.winRate}%.`}
                            triggerAriaLabel={`Histórico de ${debater.debaterName}`}
                          />
                        </>
                      ) : (
                        <span>Aguardando debates</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score Metric */}
                <div className="text-right shrink-0 pl-2 font-mono">
                  <span className="text-xs font-black text-primary block">
                    {debater.debatesCount > 0 ? `${debater.avgScore}` : '-'}
                  </span>
                  <span className="text-[9px] text-text-muted block">
                    {debater.debatesCount > 0 ? 'pontos' : 'pendente'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
