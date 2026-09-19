import { FC } from 'react';
import { Link } from 'react-router';
import { Trophy, ChevronRight, User, Users } from 'lucide-react';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';

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
          <p className="font-semibold text-text-main">Nenhum debatedor no Supabase</p>
          <p className="text-[11px] leading-relaxed">
            Cadastre debatedores na base de dados para que apareçam aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {topDebaters.slice(0, 10).map((debater, index) => {
            const isSelected =
              selectedDebater === debater.debaterId ||
              selectedDebater === debater.debaterName;

            return (
              <button
                key={debater.debaterId}
                type="button"
                onClick={() =>
                  onSelectDebater(isSelected ? '' : debater.debaterName)
                }
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-primary/15 border border-primary/40 text-primary'
                    : 'hover:bg-surface-hover border border-transparent text-text-muted hover:text-text-main'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Number */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold border ${getRankBadge(
                      index
                    )}`}
                  >
                    {index + 1}º
                  </div>

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border overflow-hidden shrink-0">
                    {debater.photoUrl ? (
                      <img
                        src={debater.photoUrl}
                        alt={debater.debaterName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <User size={14} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="truncate">
                    <div className="text-xs font-bold text-text-main truncate">
                      {debater.debaterName}
                    </div>
                    <div className="text-[10px] text-text-muted font-mono truncate">
                      {debater.debatesCount > 0
                        ? `${debater.wins}V - ${debater.draws}E - ${debater.losses}D (${debater.winRate}%)`
                        : 'Aguardando debates'}
                    </div>
                  </div>
                </div>

                {/* Score Metric */}
                <div className="text-right shrink-0 pl-2">
                  <span className="text-xs font-mono font-black text-primary block">
                    {debater.debatesCount > 0 ? `${debater.avgScore}` : '-'}
                  </span>
                  <span className="text-[9px] text-text-muted font-mono block">
                    {debater.debatesCount > 0 ? 'pts' : 'pendente'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
