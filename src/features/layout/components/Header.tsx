import { FC } from 'react';
import { NavLink, Link } from 'react-router';
import { Trophy, Users, LayoutDashboard } from 'lucide-react';
import { SecurityBadge } from '@/features/security/components/SecurityBadge';
import { FeedbackButton } from '@/features/feedback/components/FeedbackButton';

export interface HeaderProps {
  onOpenFeedback: () => void;
}

export const Header: FC<HeaderProps> = ({ onOpenFeedback }) => {
  const navItems = [
    { to: '/', label: 'Início', icon: LayoutDashboard },
    { to: '/debaters', label: 'Debatedores', icon: Users },
    { to: '/ranking', label: 'Ranking', icon: Trophy }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform hover:scale-105"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-black text-base shadow-sm shadow-primary/20 group-hover:bg-primary/25 transition-all">
              Δ
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-text-main flex items-center gap-1.5 leading-none">
                Argumeta
              </span>
              <span className="text-[10px] text-text-muted mt-0.5 tracking-wide hidden sm:inline">
                Inteligência e Análise de Debates
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-surface-elevated text-primary border border-primary/30 shadow-sm'
                      : 'text-text-muted hover:text-text-main hover:bg-surface-hover/70'
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Feedback Action & Security Tag */}
        <div className="flex items-center gap-3">
          <FeedbackButton onClick={onOpenFeedback} />
          <div className="hidden lg:flex items-center">
            <SecurityBadge />
          </div>
        </div>
      </div>
    </header>
  );
};
