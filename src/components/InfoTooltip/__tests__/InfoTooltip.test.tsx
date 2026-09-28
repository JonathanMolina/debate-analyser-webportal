import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfoTooltip } from '../InfoTooltip';

describe('InfoTooltip Component', () => {
  it('deve renderizar o trigger e não exibir o conteúdo inicialmente', () => {
    render(
      <InfoTooltip content="Explicação do indicador">
        <span>Métrica</span>
      </InfoTooltip>
    );

    expect(screen.getByText('Métrica')).toBeInTheDocument();
    expect(screen.queryByText('Explicação do indicador')).not.toBeInTheDocument();
  });

  it('deve exibir o conteúdo ao passar o mouse (desktop hover) e ocultar ao sair', () => {
    render(
      <InfoTooltip content="Explicação do indicador" title="Título da Métrica">
        <span>Métrica</span>
      </InfoTooltip>
    );

    const trigger = screen.getByText('Métrica').parentElement!;
    fireEvent.mouseEnter(trigger);

    expect(screen.getByText('Título da Métrica')).toBeInTheDocument();
    expect(screen.getByText('Explicação do indicador')).toBeInTheDocument();

    fireEvent.mouseLeave(trigger);
    expect(screen.queryByText('Explicação do indicador')).not.toBeInTheDocument();
  });

  it('deve alternar a visibilidade ao clicar no ícone de informação (smartphone click/tap)', () => {
    render(
      <InfoTooltip content="Explicação para celular" triggerAriaLabel="Ajuda sobre pontuação">
        <span>Pontuação</span>
      </InfoTooltip>
    );

    const button = screen.getByRole('button', { name: 'Ajuda sobre pontuação' });
    expect(button).toBeInTheDocument();

    // Primeiro clique abre
    fireEvent.click(button);
    expect(screen.getByText('Explicação para celular')).toBeInTheDocument();

    // Segundo clique fecha
    fireEvent.click(button);
    expect(screen.queryByText('Explicação para celular')).not.toBeInTheDocument();
  });

  it('deve fechar ao pressionar a tecla Escape', () => {
    render(
      <InfoTooltip content="Texto informativo">
        <span>Indicador</span>
      </InfoTooltip>
    );

    const button = screen.getByRole('button', { name: 'Mais informações' });
    fireEvent.click(button);
    expect(screen.getByText('Texto informativo')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Texto informativo')).not.toBeInTheDocument();
  });

  it('deve fechar ao clicar fora do componente', () => {
    render(
      <div>
        <div data-testid="outside">Fora</div>
        <InfoTooltip content="Texto informativo">
          <span>Indicador</span>
        </InfoTooltip>
      </div>
    );

    const button = screen.getByRole('button', { name: 'Mais informações' });
    fireEvent.click(button);
    expect(screen.getByText('Texto informativo')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Texto informativo')).not.toBeInTheDocument();
  });
});
