import { FC } from 'react';
import { Trophy, Scale, HelpCircle } from 'lucide-react';
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
  const maxAudiencePoints = speakerNames.length * 50;

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
              {speakerNames.some((spk) => score.breakdown[spk].audiencePoints !== undefined) && (
                <tr className="bg-amber-500/5">
                  <td className="p-3.5 text-text-main font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">★</span>
                      <span>Opinião do Público (Comentários YouTube)</span>
                      <span className="text-[10px] text-text-muted font-normal font-mono">
                        (até +{maxAudiencePoints} pts distrib.)
                      </span>
                      <div
                        className="relative group cursor-help inline-flex items-center"
                        title={`Avaliação semântica via IA com auditoria de ironias nos comentários do YouTube. Distribui até 50 pontos por debatedor (${maxAudiencePoints} pontos totais para ${speakerNames.length} debatedores).`}
                      >
                        <HelpCircle size={13} className="text-amber-400/80" />
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col w-72 p-3 bg-surface-elevated text-xs font-sans text-text-main rounded-xl shadow-xl border border-border z-50 pointer-events-none leading-snug">
                          <strong className="text-amber-400 font-semibold mb-1 flex items-center gap-1">
                            <span>Veredito Popular & IA</span>
                          </strong>
                          <span className="text-[11px] text-text-muted font-normal">
                            Baseada nos comentários mais curtidos do YouTube com detecção de ironias e citações cruzadas na transcrição. São até 50 pontos máximos distribuídos por debatedor (ex: 100 pts em debates de 2 debatedores, 250 pts em debates de 5 debatedores).
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  {speakerNames.map((spk) => (
                    <td key={spk} className="p-3.5 text-right font-bold text-amber-400">
                      +{score.breakdown[spk].audiencePoints ?? 0} pts
                    </td>
                  ))}
                </tr>
              )}
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
