import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SupportFloatingPanel } from '../SupportFloatingPanel';

describe('SupportFloatingPanel Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve renderizar a mensagem de plataforma pública e ausência de planos pagos', () => {
    render(<SupportFloatingPanel />);
    expect(screen.getByText(/Apoie a Plataforma Argumeta/i)).toBeInTheDocument();
    expect(screen.getByText(/Não possuímos assinaturas pagas nem paywalls/i)).toBeInTheDocument();
    expect(screen.getByText(/QR Code Pix/i)).toBeInTheDocument();
  });

  it('deve permitir colapsar e expandir o painel flutuante', () => {
    render(<SupportFloatingPanel />);
    const minimizeBtn = screen.getByTitle(/Minimizar painel de apoio/i);
    fireEvent.click(minimizeBtn);

    // Agora deve exibir o botão colapsado
    expect(screen.getByText(/Apoiar o Argumeta/i)).toBeInTheDocument();

    // Clicar no botão colapsado para reabrir
    const openBtn = screen.getByTitle(/Abrir painel de apoio e doações/i);
    fireEvent.click(openBtn);

    expect(screen.getByText(/Não possuímos assinaturas pagas nem paywalls/i)).toBeInTheDocument();
  });
});
