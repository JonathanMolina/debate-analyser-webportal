import { FC } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const SecurityBadge: FC = () => {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-400 font-mono select-none">
      <ShieldCheck size={13} className="text-primary animate-pulse" />
      <span>Ambiente Protegido • Modo Seguro</span>
    </div>
  );
};
