import { FC } from 'react';
import { Trophy, User, Award } from 'lucide-react';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';

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
              O pódio oficial com medalhas de ouro, prata e bronze será formado automaticamente assim que os primeiros debates forem concluídos e auditados pelo pipeline no Supabase.
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
            <div className="w-16 h-16 rounded-full bg-surface-elevated border-2 border-slate-300 shadow-md overflow-hidden">
              {second.photoUrl ? (
                <img
                  src={second.photoUrl}
                  alt={second.debaterName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <User size={26} />
                </div>
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md border-2 border-surface font-mono">
              2º
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-text-main truncate max-w-[200px]">
              {second.debaterName}
            </h3>
            <div className="text-[11px] text-text-muted font-mono mt-0.5">
              {second.wins}V - {second.draws}E - {second.losses}D ({second.winRate}%)
            </div>
          </div>

          <div className="w-full bg-canvas rounded-xl p-3 border border-border/60 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-text-muted block">Média Técnica</span>
              <span className="font-black text-primary text-base">{second.avgScore} pts</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted block">Falácias / Deb</span>
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
            <div className="w-20 h-20 rounded-full bg-surface-elevated border-3 border-amber-400 shadow-xl overflow-hidden ring-4 ring-primary/20">
              {first.photoUrl ? (
                <img
                  src={first.photoUrl}
                  alt={first.debaterName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <User size={32} />
                </div>
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-black text-sm shadow-md border-2 border-surface font-mono">
              1º
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base text-text-main truncate max-w-[220px]">
              {first.debaterName}
            </h3>
            <div className="text-xs text-text-muted font-mono mt-0.5">
              {first.wins}V - {first.draws}E - {first.losses}D ({first.winRate}% de vitórias)
            </div>
          </div>

          <div className="w-full bg-canvas rounded-xl p-3.5 border border-primary/30 grid grid-cols-2 gap-2 text-xs font-mono shadow-inner">
            <div>
              <span className="text-[10px] text-text-muted block">Média Técnica</span>
              <span className="font-black text-primary text-lg">{first.avgScore} pts</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted block">Precisão Factual</span>
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
            <div className="w-16 h-16 rounded-full bg-surface-elevated border-2 border-amber-700 shadow-md overflow-hidden">
              {third.photoUrl ? (
                <img
                  src={third.photoUrl}
                  alt={third.debaterName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <User size={26} />
                </div>
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-bold text-xs shadow-md border-2 border-surface font-mono">
              3º
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-text-main truncate max-w-[200px]">
              {third.debaterName}
            </h3>
            <div className="text-[11px] text-text-muted font-mono mt-0.5">
              {third.wins}V - {third.draws}E - {third.losses}D ({third.winRate}%)
            </div>
          </div>

          <div className="w-full bg-canvas rounded-xl p-3 border border-border/60 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-text-muted block">Média Técnica</span>
              <span className="font-black text-primary text-base">{third.avgScore} pts</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted block">Falácias / Deb</span>
              <span className="font-bold text-rose-400 text-base">{third.avgFallaciesPerDebate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
