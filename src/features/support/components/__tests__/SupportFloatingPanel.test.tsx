import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SupportFloatingPanel } from '../SupportFloatingPanel';

describe('SupportFloatingPanel Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve iniciar colapsado e expandir automaticamente após 10 segundos', () => {
    render(<SupportFloatingPanel />);

    // Inicialmente está colapsado no botão pílula
    expect(screen.getByText(/Apoiar o Argumeta/i)).toBeInTheDocument();
    expect(screen.queryByText(/Link de Pagamento:/i)).not.toBeInTheDocument();

    // Avança 10 segundos
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Agora deve estar expandido automaticamente
    expect(screen.getByText(/Apoie a Plataforma Argumeta/i)).toBeInTheDocument();
    expect(screen.getByText(/Mercado Pago \(Pix, Cartão, Boleto\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Link de Pagamento:/i)).toBeInTheDocument();
    expect(screen.getByText(/link.mercadopago.com.br\/argumeta/i)).toBeInTheDocument();
  });

  it('deve permitir colapsar e reabrir manualmente o painel', () => {
    render(<SupportFloatingPanel />);

    // Avança 10 segundos para expandir
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    const minimizeBtn = screen.getByTitle(/Minimizar painel de apoio/i);
    fireEvent.click(minimizeBtn);

    // Agora deve exibir o botão colapsado
    expect(screen.getByText(/Apoiar o Argumeta/i)).toBeInTheDocument();

    // Clicar no botão colapsado para reabrir
    const openBtn = screen.getByTitle(/Abrir painel de apoio e doações/i);
    fireEvent.click(openBtn);

    expect(screen.getByText(/Apoie a Plataforma Argumeta/i)).toBeInTheDocument();
  });

  it('deve abrir e fechar o modal de ampliação do QR Code', () => {
    render(<SupportFloatingPanel />);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    const qrBtn = screen.getByTitle(/Clique para ampliar o QR Code do link de pagamento/i);
    fireEvent.click(qrBtn);

    expect(screen.getByText(/Escanear Link de Pagamento/i)).toBeInTheDocument();

    const closeBtn = screen.getByTitle(/Fechar/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/Escanear Link de Pagamento/i)).not.toBeInTheDocument();
  });

  it('deve chamar navigator.clipboard ao clicar no botão Copiar', () => {
    render(<SupportFloatingPanel />);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    const copyBtn = screen.getByTitle(/Copiar link de pagamento/i);
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://link.mercadopago.com.br/argumeta');
  });

  it('deve conter botão para abrir diretamente o link com atributos seguros', () => {
    render(<SupportFloatingPanel />);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    const openPaymentLink = screen.getByTitle(/Ir para o link de pagamento do Mercado Pago/i);
    expect(openPaymentLink).toBeInTheDocument();
    expect(openPaymentLink).toHaveAttribute('href', 'https://link.mercadopago.com.br/argumeta');
    expect(openPaymentLink).toHaveAttribute('target', '_blank');
    expect(openPaymentLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
