import { FC } from 'react';
import { Trophy, Scale, ShieldCheck } from 'lucide-react';
import type { DebateScore, SpeakerInput } from '../types/debate.types';

export interface ScoreBreakdownPanelProps {
  score?: DebateScore;
  speakers?: SpeakerInput[];
}

export const ScoreBreakdownPanel: FC<ScoreBreakdownPanelProps> = ({
  score,
  speakers = []
}) => {
  if (!score || !score.breakdown) {
    return (
      <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
        Pontuação técnica em consolidação algorítmica.
      </div>
    );
  }

  const speakerNames = Object.keys(score.breakdown);

  return (
    <div className="space-y-6">
      {/* Top Banner with Winner & Difference */}
      <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Trophy size={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">
              Resultado Algorítmico do Debate
            </span>
            <h3 className="text-lg font-extrabold text-text-main">
              {score.isDraw
                ? 'Empate Técnico'
                : `Vencedor por Métricas: ${score.winner}`}
            </h3>
            {!score.isDraw && (
              <span className="text-xs text-primary font-mono font-semibold">
                Diferença técnica: +{score.difference} pontos
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {speakerNames.map((spk) => {
            const isWinner = score.winner === spk && !score.isDraw;
            return (
              <div
                key={spk}
                className={`p-3 rounded-xl border text-center font-mono min-w-[110px] ${
                  isWinner
                    ? 'bg-primary/15 border-primary text-primary'
                    : 'bg-canvas border-border text-text-muted'
                }`}
              >
                <span className="text-[10px] uppercase block truncate max-w-[100px]">
                  {spk}
                </span>
                <span className="text-xl font-black block">
                  {score.scores[spk] ?? 100}
                </span>
                <span className="text-[9px] block">pontos</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown Table Comparison */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-surface-elevated/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted font-mono flex items-center gap-2">
            <Scale size={14} className="text-primary" />
            <span>Detalhamento dos Critérios de Pontuação Técnica</span>
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border/80 text-text-muted">
                <th className="p-3.5">Critério Avaliado</th>
                {speakerNames.map((spk) => (
                  <th key={spk} className="p-3.5 text-right font-bold text-text-main">
                    {spk}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-3.5 text-text-muted">Evidências & Fatos Verificados (+15 V, -15 F)</td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-emerald-400">
                    +{score.breakdown[spk].evidencePoints} pts
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-text-muted">Penalidades por Falácias Retóricas</td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-rose-400">
                    {score.breakdown[spk].fallacyPenalties} pts
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-text-muted">Eficiência em Respostas Diretas</td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-text-main">
                    +{score.breakdown[spk].qaPoints} pts
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-text-muted">Controle Tonal & Compostura Sob Pressão</td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-text-main">
                    +{score.breakdown[spk].tonePoints} pts
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-text-muted">Eficiência Temporal & Ritmo de Fala</td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-text-main">
                    +{score.breakdown[spk].speakingEfficiency} pts
                  </td>
                ))}
              </tr>
              <tr className="bg-surface-elevated/80 font-bold">
                <td className="p-3.5 text-text-main">Total Consolidado</td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right text-sm text-primary">
                    {score.breakdown[spk].totalPoints} pts
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
