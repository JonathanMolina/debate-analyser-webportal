import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AudienceSentimentPanel } from '../AudienceSentimentPanel';
import type { AudienceMetrics, SpeakerInput } from '../../types/debate.types';

const mockSpeakers: SpeakerInput[] = [
  { name: 'Debatedor Alfa' },
  { name: 'Debatedor Beta' }
];

const mockAudienceMetrics: AudienceMetrics = {
  totalCommentsAnalyzed: 850,
  favoredWinner: 'Debatedor Alfa',
  winnerAgreementWithAlgorithm: true,
  publicVerdictSummary: 'A comunidade preferiu a argumentação fundamentada de Debatedor Alfa.',
  speakersFeedback: {
    'Debatedor Alfa': {
      speakerName: 'Debatedor Alfa',
      approvalPercentage: 70,
      supportCount: 595,
      keyReasons: [
        'Apresentou números concretos sem rodeios',
        'Manteve a calma perante acusações'
      ]
    },
    'Debatedor Beta': {
      speakerName: 'Debatedor Beta',
      approvalPercentage: 30,
      supportCount: 255,
      keyReasons: [
        'Forte oratória e clareza de dicção'
      ]
    }
  },
  topComments: [
    {
      id: 'c1',
      author: '@usuario_um',
      text: 'O Debatedor Alfa dominou do início ao fim com dados reais.',
      likes: 1200,
      favoredSpeaker: 'Debatedor Alfa'
    },
    {
      id: 'c2',
      author: '@usuario_dois',
      text: 'Debatedor Beta teve uma boa fala final, mas faltou consistência.',
      likes: 450,
      favoredSpeaker: 'Debatedor Beta'
    }
  ]
};

describe('AudienceSentimentPanel Component', () => {
  it('deve exibir mensagem informativa quando não houver dados de audiência', () => {
    render(<AudienceSentimentPanel />);
    expect(
      screen.getByText('Métricas de Audiência em Consolidação')
    ).toBeInTheDocument();
  });

  it('deve renderizar o veredito popular e o alinhamento com a análise técnica', () => {
    render(
      <AudienceSentimentPanel
        audienceMetrics={mockAudienceMetrics}
        speakers={mockSpeakers}
        technicalWinner="Debatedor Alfa"
      />
    );

    expect(screen.getByText(/Vencedor Popular:/i)).toBeInTheDocument();
    expect(screen.getAllByText('Debatedor Alfa').length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Concordância com o Algoritmo Técnico/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/850 comentários auditados/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockAudienceMetrics.publicVerdictSummary)
    ).toBeInTheDocument();
  });

  it('deve renderizar os motivos apontados pelas pessoas para cada debatedor', () => {
    render(
      <AudienceSentimentPanel
        audienceMetrics={mockAudienceMetrics}
        speakers={mockSpeakers}
        technicalWinner="Debatedor Alfa"
      />
    );

    expect(
      screen.getByText('Por Quais Motivos Segundo as Pessoas')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Apresentou números concretos sem rodeios')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Manteve a calma perante acusações')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Forte oratória e clareza de dicção')
    ).toBeInTheDocument();
  });

  it('deve renderizar os comentários mais curtidos e permitir filtrar por debatedor', () => {
    render(
      <AudienceSentimentPanel
        audienceMetrics={mockAudienceMetrics}
        speakers={mockSpeakers}
        technicalWinner="Debatedor Alfa"
      />
    );

    expect(
      screen.getByText(/Top 15 Comentários Mais Curtidos do Vídeo/i)
    ).toBeInTheDocument();
    expect(screen.getByText('@usuario_um')).toBeInTheDocument();
    expect(screen.getByText('1.2k')).toBeInTheDocument();
    expect(screen.getByText('@usuario_dois')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument();

    // Filtrar apenas Debatedor Beta
    const betaFilterBtn = screen.getByRole('button', { name: 'Debatedor Beta' });
    fireEvent.click(betaFilterBtn);

    expect(screen.queryByText('@usuario_um')).not.toBeInTheDocument();
    expect(screen.getByText('@usuario_dois')).toBeInTheDocument();
  });

  it('deve exibir impacto no score proporcional à quantidade de debatedores (50 pts por debatedor)', () => {
    // 2 debatedores = 100 pts
    const { rerender } = render(
      <AudienceSentimentPanel
        audienceMetrics={mockAudienceMetrics}
        speakers={mockSpeakers}
        technicalWinner="Debatedor Alfa"
      />
    );
    expect(screen.getByText('Até +100 pts no Scorecard')).toBeInTheDocument();
    expect(screen.getByText('(50 pts máx por debatedor)')).toBeInTheDocument();

    // 5 debatedores = 250 pts
    const fiveSpeakers: SpeakerInput[] = [
      { name: 'Debatedor 1' },
      { name: 'Debatedor 2' },
      { name: 'Debatedor 3' },
      { name: 'Debatedor 4' },
      { name: 'Debatedor 5' }
    ];
    rerender(
      <AudienceSentimentPanel
        audienceMetrics={mockAudienceMetrics}
        speakers={fiveSpeakers}
        technicalWinner="Debatedor 1"
      />
    );
    expect(screen.getByText('Até +250 pts no Scorecard')).toBeInTheDocument();
  });
});
