import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Header } from '../Header';

describe('Header Component', () => {
  const onOpenFeedback = vi.fn();
  const onOpenNewsletter = vi.fn();

  const renderHeader = () => {
    return render(
      <MemoryRouter>
        <Header onOpenFeedback={onOpenFeedback} onOpenNewsletter={onOpenNewsletter} />
      </MemoryRouter>
    );
  };

  it('deve renderizar a marca e links principais de navegação', () => {
    renderHeader();
    expect(screen.getByText('Argumeta')).toBeInTheDocument();
    expect(screen.getAllByText('Início')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Debatedores')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Ranking')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Sugestões')[0]).toBeInTheDocument();
  });

  it('deve alternar a visibilidade do menu mobile ao clicar no botão hamburguer', () => {
    renderHeader();

    const menuBtn = screen.getByLabelText(/Abrir menu de navegação/i);
    expect(menuBtn).toBeInTheDocument();

    // Abre o menu mobile
    fireEvent.click(menuBtn);
    expect(screen.getByLabelText(/Fechar menu de navegação/i)).toBeInTheDocument();

    // Fecha o menu mobile
    fireEvent.click(screen.getByLabelText(/Fechar menu de navegação/i));
    expect(screen.getByLabelText(/Abrir menu de navegação/i)).toBeInTheDocument();
  });

  it('deve fechar o menu mobile ao clicar em um link de navegação', () => {
    renderHeader();

    const menuBtn = screen.getByLabelText(/Abrir menu de navegação/i);
    fireEvent.click(menuBtn);

    // Clica em um link dentro do menu mobile
    const mobileLinks = screen.getAllByText('Debatedores');
    const mobileLink = mobileLinks[mobileLinks.length - 1];
    fireEvent.click(mobileLink);

    // Menu deve fechar
    expect(screen.getByLabelText(/Abrir menu de navegação/i)).toBeInTheDocument();
  });
});
