import { FC } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Users } from 'lucide-react';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';
import { DebaterAvatar } from '@/components/DebaterAvatar';
import { InfoTooltip } from '@/components/InfoTooltip';
import { METRIC_EXPLANATIONS } from '@/features/debates/utils/metricExplanations';
import type { RankingSortField } from '../types/ranking.types';

export interface RankingTableProps {
  rankingList: DebaterAggregateStats[];
  sortField: RankingSortField;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: RankingSortField) => void;
  onSelectDebater: (debater: DebaterAggregateStats) => void;
}

export const RankingTable: FC<RankingTableProps> = ({
  rankingList,
  sortField,
  sortDirection,
  onToggleSort,
  onSelectDebater
}) => {
  const renderSortIndicator = (field: RankingSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="opacity-40" />;
    }
    return sortDirection === 'desc' ? (
      <ArrowDown size={12} className="text-primary font-bold" />
    ) : (
      <ArrowUp size={12} className="text-primary font-bold" />
    );
  };

  if (rankingList.length === 0) {
    return (
      <div className="p-12 text-center bg-surface border border-border rounded-2xl space-y-3">
        <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mx-auto text-text-muted">
          <Users size={22} className="text-primary" />
        </div>
        <h3 className="font-bold text-base text-text-main">
          Nenhum debatedor no ranking
        </h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          Não há debatedores registrados no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-elevated/60 text-text-muted font-mono uppercase tracking-wider select-none">
              <th className="p-4 w-14 text-center">#</th>
              <th className="p-4">Debatedor</th>
              <th
                onClick={() => onToggleSort('avgScore')}
                className="p-4 cursor-pointer hover:text-text-main transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Pontuação Geral</span>
                  <InfoTooltip
                    title={METRIC_EXPLANATIONS.overallScore.title}
                    content={METRIC_EXPLANATIONS.overallScore.shortHint}
                  />
                  {renderSortIndicator('avgScore')}
                </div>
              </th>
              <th
                onClick={() => onToggleSort('winRate')}
                className="p-4 cursor-pointer hover:text-text-main transition-colors text-right hidden sm:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Taxa de Vitórias</span>
                  <InfoTooltip
                    title={METRIC_EXPLANATIONS.winRate.title}
                    content={METRIC_EXPLANATIONS.winRate.shortHint}
                  />
                  {renderSortIndicator('winRate')}
                </div>
              </th>
              <th
                onClick={() => onToggleSort('avgDataDensity')}
                className="p-4 cursor-pointer hover:text-text-main transition-colors text-right hidden md:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Densidade de Dados</span>
                  <InfoTooltip
                    title={METRIC_EXPLANATIONS.dataDensity.title}
                    content={METRIC_EXPLANATIONS.dataDensity.shortHint}
                  />
                  {renderSortIndicator('avgDataDensity')}
                </div>
              </th>
              <th
                onClick={() => onToggleSort('avgDirectAnswerRate')}
                className="p-4 cursor-pointer hover:text-text-main transition-colors text-right hidden lg:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Respostas Diretas</span>
                  <InfoTooltip
                    title={METRIC_EXPLANATIONS.directAnswerRate.title}
                    content={METRIC_EXPLANATIONS.directAnswerRate.shortHint}
                  />
                  {renderSortIndicator('avgDirectAnswerRate')}
                </div>
              </th>
              <th
                onClick={() => onToggleSort('avgEmotionalControl')}
                className="p-4 cursor-pointer hover:text-text-main transition-colors text-right hidden lg:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Controle Emocional</span>
                  <InfoTooltip
                    title={METRIC_EXPLANATIONS.emotionalControl.title}
                    content={METRIC_EXPLANATIONS.emotionalControl.shortHint}
                  />
                  {renderSortIndicator('avgEmotionalControl')}
                </div>
              </th>
              <th
                onClick={() => onToggleSort('fewestFallacies')}
                className="p-4 cursor-pointer hover:text-text-main transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Falácias por Debate</span>
                  <InfoTooltip
                    title={METRIC_EXPLANATIONS.fallaciesPerDebate.title}
                    content={METRIC_EXPLANATIONS.fallaciesPerDebate.shortHint}
                  />
                  {renderSortIndicator('fewestFallacies')}
                </div>
              </th>
              <th
                onClick={() => onToggleSort('factCheckAccuracy')}
                className="p-4 cursor-pointer hover:text-text-main transition-colors text-right hidden md:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Precisão Factual</span>
                  <InfoTooltip
                    title={METRIC_EXPLANATIONS.factCheckAccuracy.title}
                    content={METRIC_EXPLANATIONS.factCheckAccuracy.shortHint}
                  />
                  {renderSortIndicator('factCheckAccuracy')}
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {rankingList.map((item, index) => {
              const hasDebates = item.debatesCount > 0;
              return (
                <tr
                  key={item.debaterId}
                  onClick={() => onSelectDebater(item)}
                  className="hover:bg-surface-hover/80 transition-colors cursor-pointer group"
                >
                  {/* Rank Position */}
                  <td className="p-4 text-center font-mono font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                        index === 0 && hasDebates
                          ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
                          : index === 1 && hasDebates
                          ? 'bg-slate-300/20 text-slate-300 border border-slate-300/40'
                          : index === 2 && hasDebates
                          ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                          : 'text-text-muted'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>

                  {/* Debater Name & Photo */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <DebaterAvatar
                        name={item.debaterName}
                        photoUrl={item.photoUrl}
                        debaterId={item.debaterId}
                        size="md"
                        className="w-9 h-9"
                      />
                      <div>
                        <div className="font-bold text-text-main group-hover:text-primary transition-colors">
                          {item.debaterName}
                        </div>
                        {item.role ? (
                          <div className="text-[11px] text-text-muted">
                            {item.role}
                          </div>
                        ) : (
                          <div className="text-[10px] text-text-muted font-mono">
                            {item.debatesCount} debates processados
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Overall Score */}
                  <td className="p-4 text-right font-mono">
                    <span className="font-black text-sm text-primary">
                      {hasDebates ? item.avgScore : '-'}
                    </span>
                    <span className="text-[10px] text-text-muted block">
                      {hasDebates ? 'pontos' : 'pendente'}
                    </span>
                  </td>

                  {/* Win Rate */}
                  <td className="p-4 text-right font-mono hidden sm:table-cell">
                    <span className="font-semibold text-text-main">
                      {hasDebates ? `${item.winRate}%` : '-'}
                    </span>
                    {hasDebates && (
                      <span className="text-[10px] text-text-muted flex items-center justify-end gap-1 mt-0.5">
                        <span>{item.wins} vit. • {item.losses} der.</span>
                        <InfoTooltip
                          title={METRIC_EXPLANATIONS.matchRecord.title}
                          content={`${item.wins} ${item.wins === 1 ? 'vitória' : 'vitórias'} e ${item.losses} ${item.losses === 1 ? 'derrota' : 'derrotas'} em debates analisados.`}
                          triggerAriaLabel={`Histórico de ${item.debaterName}`}
                        />
                      </span>
                    )}
                  </td>

                  {/* Data Density */}
                  <td className="p-4 text-right font-mono hidden md:table-cell">
                    <span className="font-semibold text-text-main">
                      {hasDebates ? `${item.avgDataDensity}/100` : '-'}
                    </span>
                  </td>

                  {/* Direct Answer Rate */}
                  <td className="p-4 text-right font-mono hidden lg:table-cell">
                    <span className="font-semibold text-text-main">
                      {hasDebates ? `${item.avgDirectAnswerRate}%` : '-'}
                    </span>
                  </td>

                  {/* Emotional Control */}
                  <td className="p-4 text-right font-mono hidden lg:table-cell">
                    <span className="font-semibold text-text-main">
                      {hasDebates ? `${item.avgEmotionalControl}/100` : '-'}
                    </span>
                  </td>

                  {/* Fallacies per debate */}
                  <td className="p-4 text-right font-mono">
                    <span className="font-bold text-rose-400">
                      {hasDebates ? item.avgFallaciesPerDebate : '-'}
                    </span>
                    {hasDebates && (
                      <span className="text-[10px] text-text-muted flex items-center justify-end gap-1 mt-0.5">
                        <span>{item.totalFallacies} no total</span>
                        <InfoTooltip
                          title={METRIC_EXPLANATIONS.totalFallacies.title}
                          content={`Total acumulado de ${item.totalFallacies} ${item.totalFallacies === 1 ? 'falácia' : 'falácias'} identificadas nos debates.`}
                          triggerAriaLabel={`Total de falácias de ${item.debaterName}`}
                        />
                      </span>
                    )}
                  </td>

                  {/* Fact Check Accuracy */}
                  <td className="p-4 text-right font-mono hidden md:table-cell">
                    <span className="font-bold text-emerald-400">
                      {hasDebates ? `${item.factCheckAccuracy}%` : '-'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
