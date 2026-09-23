import { FC, useState } from 'react';
import { NavLink, Link } from 'react-router';
import { Trophy, Users, LayoutDashboard, Lightbulb, Menu, X } from 'lucide-react';
import { FeedbackButton } from '@/features/feedback/components/FeedbackButton';
import { NewsletterButton } from '@/features/newsletter/components/NewsletterButton';

export interface HeaderProps {
  onOpenFeedback: () => void;
  onOpenNewsletter?: () => void;
}

export const Header: FC<HeaderProps> = ({ onOpenFeedback, onOpenNewsletter }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Início', icon: LayoutDashboard },
    { to: '/debaters', label: 'Debatedores', icon: Users },
    { to: '/ranking', label: 'Ranking', icon: Trophy },
    { to: '/sugestoes', label: 'Sugestões', icon: Lightbulb }
  ];

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            onClick={handleCloseMenu}
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

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
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

        {/* Desktop Action Buttons: Newsletter & Feedback */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          {onOpenNewsletter && (
            <NewsletterButton onClick={onOpenNewsletter} />
          )}
          <FeedbackButton onClick={onOpenFeedback} />
        </div>

        {/* Mobile Actions: Compact buttons & Hamburger toggle */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
          {onOpenNewsletter && (
            <NewsletterButton
              onClick={onOpenNewsletter}
              size="sm"
              className="text-xs px-2.5"
            />
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-surface-hover border border-border/80 transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface/98 backdrop-blur-xl px-4 py-4 space-y-3 animate-fadeIn shadow-2xl">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={handleCloseMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-surface-elevated text-primary border border-primary/30 shadow-sm'
                        : 'text-text-muted hover:text-text-main hover:bg-surface-hover/70'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
            <FeedbackButton
              onClick={() => {
                handleCloseMenu();
                onOpenFeedback();
              }}
              className="w-full justify-center"
            />
          </div>
        </div>
      )}
    </header>
  );
};
