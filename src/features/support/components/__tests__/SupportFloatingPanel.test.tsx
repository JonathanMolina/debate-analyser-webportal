import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SupportFloatingPanel } from '../SupportFloatingPanel';

describe('SupportFloatingPanel Component', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });
  });

  it('deve renderizar a mensagem de apoio à plataforma e dados do Pix', () => {
    render(<SupportFloatingPanel />);
    expect(screen.getByText(/Apoie a Plataforma Argumeta/i)).toBeInTheDocument();
    expect(screen.getByText(/Não possuímos assinaturas pagas nem paywalls/i)).toBeInTheDocument();
    expect(screen.getByText(/Chave Pix:/i)).toBeInTheDocument();
    expect(screen.getByText(/Pix Copia e Cola/i)).toBeInTheDocument();
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

  it('deve abrir e fechar o modal de ampliação do QR Code', () => {
    render(<SupportFloatingPanel />);
    const qrBtn = screen.getByTitle(/Clique para ampliar o QR Code/i);
    fireEvent.click(qrBtn);

    expect(screen.getByText(/Escanear QR Code Pix/i)).toBeInTheDocument();

    const closeBtn = screen.getByTitle(/Fechar/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/Escanear QR Code Pix/i)).not.toBeInTheDocument();
  });

  it('deve permitir exibir o texto completo do Pix Copia e Cola', () => {
    render(<SupportFloatingPanel />);
    const toggleTextBtn = screen.getByText(/Ver \/ selecionar texto completo/i);
    fireEvent.click(toggleTextBtn);

    expect(screen.getByLabelText(/Texto do Pix Copia e Cola/i)).toBeInTheDocument();
  });

  it('deve chamar navigator.clipboard ao clicar para copiar', () => {
    render(<SupportFloatingPanel />);
    const copyPayloadBtn = screen.getByTitle(/Copiar código Pix Copia e Cola/i);
    fireEvent.click(copyPayloadBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
