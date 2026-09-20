import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DebateTimeline } from '../DebateTimeline';
import type { TurnItem, SpeakerInput } from '../../types/debate.types';

describe('DebateTimeline Component', () => {
  const mockSpeakers: SpeakerInput[] = [
    { name: 'Debatedor A', previewUrl: 'https://example.com/a.jpg' },
    { name: 'Debatedor B', previewUrl: 'https://example.com/b.jpg' }
  ];

  const mockTimeline: TurnItem[] = [
    {
      speaker: 'Debatedor A',
      start: 15,
      end: 45,
      text: 'Primeiro argumento sobre desenvolvimento econômico e metas fiscais.',
      temperature: 0.42,
      confidence: 0.95
    },
    {
      speaker: 'Debatedor B',
      start: 50,
      end: 90,
      text: 'Réplica abordando a eficiência dos gastos públicos.',
      temperature: 0.68,
      confidence: 0.92
    }
  ];

  it('deve exibir mensagem apropriada quando a timeline estiver vazia', () => {
    render(<DebateTimeline timeline={[]} onSeek={vi.fn()} />);
    expect(
      screen.getByText(/Nenhuma transcrição ou timeline disponível/i)
    ).toBeInTheDocument();
  });

  it('deve renderizar as falas dos debatedores com textos e formatação de tempo', () => {
    render(
      <DebateTimeline
        timeline={mockTimeline}
        speakers={mockSpeakers}
        onSeek={vi.fn()}
      />
    );

    expect(screen.getByText('Debatedor A')).toBeInTheDocument();
    expect(screen.getByText('Debatedor B')).toBeInTheDocument();
    expect(
      screen.getByText(/"Primeiro argumento sobre desenvolvimento econômico e metas fiscais."/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/"Réplica abordando a eficiência dos gastos públicos."/i)
    ).toBeInTheDocument();
    expect(screen.getByText('0:15 - 0:45')).toBeInTheDocument();
    expect(screen.getByText('0:50 - 1:30')).toBeInTheDocument();
  });

  it('deve chamar onSeek com os segundos corretos ao clicar no botão de tempo', () => {
    const onSeekMock = vi.fn();
    render(
      <DebateTimeline
        timeline={mockTimeline}
        speakers={mockSpeakers}
        onSeek={onSeekMock}
      />
    );

    const firstTimeBtn = screen.getByText('0:15 - 0:45').closest('button');
    expect(firstTimeBtn).not.toBeNull();
    fireEvent.click(firstTimeBtn!);

    expect(onSeekMock).toHaveBeenCalledTimes(1);
    expect(onSeekMock).toHaveBeenCalledWith(15);

    const secondTimeBtn = screen.getByText('0:50 - 1:30').closest('button');
    fireEvent.click(secondTimeBtn!);
    expect(onSeekMock).toHaveBeenCalledTimes(2);
    expect(onSeekMock).toHaveBeenCalledWith(50);
  });

  it('deve possuir container com scroll e classe de altura máxima', () => {
    render(
      <DebateTimeline
        timeline={mockTimeline}
        speakers={mockSpeakers}
        onSeek={vi.fn()}
        maxHeightClass="max-h-[500px]"
      />
    );

    const scrollContainer = screen.getByTestId('debate-timeline-scroll');
    expect(scrollContainer).toHaveClass('overflow-y-auto');
    expect(scrollContainer).toHaveClass('max-h-[500px]');
  });

  it('deve destacar a fala que corresponde ao currentTimestamp ativo', () => {
    render(
      <DebateTimeline
        timeline={mockTimeline}
        speakers={mockSpeakers}
        currentTimestamp={30}
        onSeek={vi.fn()}
      />
    );

    const activeTurnBtn = screen.getByText('0:15 - 0:45').closest('button');
    expect(activeTurnBtn).toHaveClass('bg-primary');

    const inactiveTurnBtn = screen.getByText('0:50 - 1:30').closest('button');
    expect(inactiveTurnBtn).not.toHaveClass('bg-primary');
  });
});
