import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DisclaimerBanner } from '../DisclaimerBanner';

describe('DisclaimerBanner Component', () => {
  it('deve renderizar o aviso explícito de imparcialidade e limitações da IA', () => {
    render(<DisclaimerBanner />);
    expect(screen.getByText(/Análise Algorítmica & Imparcialidade Irrestrita/i)).toBeInTheDocument();
    expect(screen.getByText(/Não há interferência ou alteração manual de dados e estatísticas por humanos/i)).toBeInTheDocument();
  });

  it('deve alternar a exibição de critérios éticos ao clicar no botão', () => {
    render(<DisclaimerBanner />);
    const toggleButton = screen.getByRole('button', { name: /Critérios éticos/i });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText(/Limitações dos Modelos de IA/i)).toBeInTheDocument();
    expect(screen.getByText(/Neutralidade de Critérios/i)).toBeInTheDocument();
    expect(screen.getByText(/Integridade dos Registros/i)).toBeInTheDocument();
  });
});
