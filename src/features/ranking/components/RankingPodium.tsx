import { FC } from 'react';
import { Trophy } from 'lucide-react';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';
import { DebaterAvatar } from '@/components/DebaterAvatar';
import { InfoTooltip } from '@/components/InfoTooltip';
import { METRIC_EXPLANATIONS } from '@/features/debates/utils/metricExplanations';
import { formatMatchRecordFull } from '@/features/debates/utils/metricFormatters';

export interface RankingPodiumProps {
  podium: DebaterAggregateStats[];
  onSelectDebater: (debater: DebaterAggregateStats) => void;
}

export const RankingPodium: FC<RankingPodiumProps> = ({
  podium,
  onSelectDebater
}) => {
  // Se não houver debatedores ou nenhum deles tiver debates concluídos ainda
  const hasDebatesInPodium = podium.some((d) => d.debatesCount > 0);

  if (!hasDebatesInPodium || podium.length < 2) {
    return (
      <div className="p-6 bg-surface border border-border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Trophy size={22} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-text-main">
              Pódio Técnico em Espera
            </h3>
            <p className="text-xs text-text-muted mt-0.5 max-w-xl leading-relaxed">
              O pódio oficial com medalhas de ouro, prata e bronze será formado automaticamente assim que os primeiros debates forem concluídos e processados pela plataforma.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const first = podium[0];
  const second = podium[1];
  const third = podium[2];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 items-end">
      {/* 2º LUGAR (Prata) - Coluna 1 em Desktop */}
      {second && (
        <div
          onClick={() => onSelectDebater(second)}
          className="bg-surface border border-border hover:border-slate-400/50 rounded-2xl p-5 flex flex-col items-center text-center gap-3 cursor-pointer transition-all hover:scale-[1.01] shadow-sm order-2 md:order-1"
        >
          <div className="relative">
            <DebaterAvatar
              name={second.debaterName}
              photoUrl={second.photoUrl}
              debaterId={second.debaterId}
              size="lg"
              className="w-16 h-16 border-2 border-slate-300 shadow-md"
            />
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md border-2 border-surface font-mono">
              2º
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-text-main truncate max-w-[200px]">
              {second.debaterName}
            </h3>
            <div className="text-[11px] text-text-muted mt-1 flex items-center justify-center gap-1 flex-wrap">
              <span>{formatMatchRecordFull(second.wins, second.draws, second.losses)}</span>
              <span className="font-semibold text-text-main">({second.winRate}% de vitórias)</span>
              <InfoTooltip
                title={METRIC_EXPLANATIONS.matchRecord.title}
                content={METRIC_EXPLANATIONS.matchRecord.shortHint}
                triggerAriaLabel="Informações do histórico de resultados"
              />
            </div>
          </div>

          <div className="w-full bg-canvas rounded-xl p-3 border border-border/60 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-text-muted flex items-center justify-center gap-1">
                <span>Média Técnica</span>
                <InfoTooltip
                  title={METRIC_EXPLANATIONS.technicalAverage.title}
                  content={METRIC_EXPLANATIONS.technicalAverage.shortHint}
                />
              </span>
              <span className="font-black text-primary text-base">{second.avgScore} pontos</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted flex items-center justify-center gap-1">
                <span>Falácias por Debate</span>
                <InfoTooltip
                  title={METRIC_EXPLANATIONS.fallaciesPerDebate.title}
                  content={METRIC_EXPLANATIONS.fallaciesPerDebate.shortHint}
                />
              </span>
              <span className="font-bold text-rose-400 text-base">{second.avgFallaciesPerDebate}</span>
            </div>
          </div>
        </div>
      )}

      {/* 1º LUGAR (Ouro & Campeão) - Coluna 2 em Desktop (Destacado) */}
      {first && (
        <div
          onClick={() => onSelectDebater(first)}
          className="bg-primary/10 border-2 border-primary/60 hover:border-primary rounded-2xl p-6 flex flex-col items-center text-center gap-3 cursor-pointer transition-all hover:scale-[1.02] shadow-xl order-1 md:order-2 relative"
        >
          <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Trophy size={11} className="fill-black" /> Líder do Ranking
          </div>

          <div className="relative mt-2">
            <DebaterAvatar
              name={first.debaterName}
              photoUrl={first.photoUrl}
              debaterId={first.debaterId}
              size="xl"
              className="w-20 h-20 border-3 border-amber-400 shadow-xl ring-4 ring-primary/20"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-black text-sm shadow-md border-2 border-surface font-mono">
              1º
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base text-text-main truncate max-w-[220px]">
              {first.debaterName}
            </h3>
            <div className="text-xs text-text-muted mt-1 flex items-center justify-center gap-1 flex-wrap">
              <span>{formatMatchRecordFull(first.wins, first.draws, first.losses)}</span>
              <span className="font-semibold text-text-main">({first.winRate}% de vitórias)</span>
              <InfoTooltip
                title={METRIC_EXPLANATIONS.matchRecord.title}
                content={METRIC_EXPLANATIONS.matchRecord.shortHint}
                triggerAriaLabel="Informações do histórico de resultados"
              />
            </div>
          </div>

          <div className="w-full bg-canvas rounded-xl p-3.5 border border-primary/30 grid grid-cols-2 gap-2 text-xs font-mono shadow-inner">
            <div>
              <span className="text-[10px] text-text-muted flex items-center justify-center gap-1">
                <span>Média Técnica</span>
                <InfoTooltip
                  title={METRIC_EXPLANATIONS.technicalAverage.title}
                  content={METRIC_EXPLANATIONS.technicalAverage.shortHint}
                />
              </span>
              <span className="font-black text-primary text-lg">{first.avgScore} pontos</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted flex items-center justify-center gap-1">
                <span>Precisão Factual</span>
                <InfoTooltip
                  title={METRIC_EXPLANATIONS.factCheckAccuracy.title}
                  content={METRIC_EXPLANATIONS.factCheckAccuracy.shortHint}
                />
              </span>
              <span className="font-bold text-emerald-400 text-lg">{first.factCheckAccuracy}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 3º LUGAR (Bronze) - Coluna 3 em Desktop */}
      {third && (
        <div
          onClick={() => onSelectDebater(third)}
          className="bg-surface border border-border hover:border-amber-700/50 rounded-2xl p-5 flex flex-col items-center text-center gap-3 cursor-pointer transition-all hover:scale-[1.01] shadow-sm order-3"
        >
          <div className="relative">
            <DebaterAvatar
              name={third.debaterName}
              photoUrl={third.photoUrl}
              debaterId={third.debaterId}
              size="lg"
              className="w-16 h-16 border-2 border-amber-700 shadow-md"
            />
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-bold text-xs shadow-md border-2 border-surface font-mono">
              3º
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-text-main truncate max-w-[200px]">
              {third.debaterName}
            </h3>
            <div className="text-[11px] text-text-muted mt-1 flex items-center justify-center gap-1 flex-wrap">
              <span>{formatMatchRecordFull(third.wins, third.draws, third.losses)}</span>
              <span className="font-semibold text-text-main">({third.winRate}% de vitórias)</span>
              <InfoTooltip
                title={METRIC_EXPLANATIONS.matchRecord.title}
                content={METRIC_EXPLANATIONS.matchRecord.shortHint}
                triggerAriaLabel="Informações do histórico de resultados"
              />
            </div>
          </div>

          <div className="w-full bg-canvas rounded-xl p-3 border border-border/60 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-text-muted flex items-center justify-center gap-1">
                <span>Média Técnica</span>
                <InfoTooltip
                  title={METRIC_EXPLANATIONS.technicalAverage.title}
                  content={METRIC_EXPLANATIONS.technicalAverage.shortHint}
                />
              </span>
              <span className="font-black text-primary text-base">{third.avgScore} pontos</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted flex items-center justify-center gap-1">
                <span>Falácias por Debate</span>
                <InfoTooltip
                  title={METRIC_EXPLANATIONS.fallaciesPerDebate.title}
                  content={METRIC_EXPLANATIONS.fallaciesPerDebate.shortHint}
                />
              </span>
              <span className="font-bold text-rose-400 text-base">{third.avgFallaciesPerDebate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
