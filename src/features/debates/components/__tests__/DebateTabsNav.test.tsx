import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageSquare, CheckCircle, Scale, Lightbulb } from 'lucide-react';
import { DebateTabsNav, DebateTabItem } from '../DebateTabsNav';

describe('DebateTabsNav', () => {
  const mockTabs: DebateTabItem[] = [
    {
      id: 'metrics',
      label: 'Visão geral',
      icon: Scale
    },
    {
      id: 'timeline',
      label: 'Timeline Retórica',
      icon: MessageSquare,
      count: 42,
      mobileOnly: true
    },
    {
      id: 'facts',
      label: 'Checagem de Fatos',
      icon: CheckCircle,
      count: 12
    },
    {
      id: 'proposals',
      label: 'Propostas/Soluções',
      icon: Lightbulb,
      count: 5
    }
  ];

  it('deve renderizar todas as abas com seus respectivos rótulos e contadores', () => {
    const handleTabChange = vi.fn();

    render(
      <DebateTabsNav
        tabs={mockTabs}
        activeTab="metrics"
        onTabChange={handleTabChange}
      />
    );

    expect(screen.getByText('Visão geral')).toBeInTheDocument();
    expect(screen.getByText('Timeline Retórica')).toBeInTheDocument();
    expect(screen.getByText('Checagem de Fatos')).toBeInTheDocument();
    expect(screen.getByText('Propostas/Soluções')).toBeInTheDocument();

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('deve marcar a aba ativa com aria-selected=true e disparar onTabChange no clique', () => {
    const handleTabChange = vi.fn();

    render(
      <DebateTabsNav
        tabs={mockTabs}
        activeTab="facts"
        onTabChange={handleTabChange}
      />
    );

    const factsTab = screen.getByRole('tab', { name: /Checagem de Fatos/i });
    expect(factsTab).toHaveAttribute('aria-selected', 'true');

    const proposalsTab = screen.getByRole('tab', { name: /Propostas\/Soluções/i });
    expect(proposalsTab).toHaveAttribute('aria-selected', 'false');

    fireEvent.click(proposalsTab);
    expect(handleTabChange).toHaveBeenCalledWith('proposals');
  });

  it('deve alternar entre o modo barra e o modo grade expandido no mobile', () => {
    const handleTabChange = vi.fn();

    render(
      <DebateTabsNav
        tabs={mockTabs}
        activeTab="metrics"
        onTabChange={handleTabChange}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /Ver todas/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggleButton);
    expect(screen.getByRole('button', { name: /Modo Barra/i })).toHaveAttribute('aria-expanded', 'true');

    // Ao clicar em uma aba na grade, deve chamar onTabChange e fechar a grade
    const factsTab = screen.getByRole('tab', { name: /Checagem de Fatos/i });
    fireEvent.click(factsTab);
    expect(handleTabChange).toHaveBeenCalledWith('facts');
    expect(screen.getByRole('button', { name: /Ver todas/i })).toHaveAttribute('aria-expanded', 'false');
  });
});
