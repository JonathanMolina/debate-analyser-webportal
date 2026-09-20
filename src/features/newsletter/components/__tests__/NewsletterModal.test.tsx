import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsletterModal } from '../NewsletterModal';
import { NewsletterButton } from '../NewsletterButton';
import * as newsletterApi from '../../api/newsletterApi';
import { recordDebateView } from '../../utils/debateViewTracker';

describe('NewsletterButton', () => {
  it('renders correctly and responds to click', () => {
    const handleClick = vi.fn();
    render(<NewsletterButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /abrir inscrição na newsletter/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/newsletter/i);

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('NewsletterModal', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('does not render modal content when isOpen is false', () => {
    render(<NewsletterModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText(/Receber Novas Análises & Debates/i)).not.toBeInTheDocument();
  });

  it('renders modal with channel options when isOpen is true', () => {
    render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Receber Novas Análises & Debates/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /e-mail/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ambos/i })).toBeInTheDocument();
  });

  it('switches between WhatsApp, E-mail and Ambos channels', () => {
    render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

    // Default is WhatsApp
    expect(screen.getByLabelText(/Número de WhatsApp/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Endereço de E-mail/i)).not.toBeInTheDocument();

    // Switch to E-mail
    fireEvent.click(screen.getByRole('button', { name: /e-mail/i }));
    expect(screen.queryByLabelText(/Número de WhatsApp/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Endereço de E-mail/i)).toBeInTheDocument();

    // Switch to Ambos
    fireEvent.click(screen.getByRole('button', { name: /ambos/i }));
    expect(screen.getByLabelText(/Número de WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Endereço de E-mail/i)).toBeInTheDocument();
  });

  it('displays tracked debates when user has viewed debates', () => {
    recordDebateView({ id: 'deb-abc', title: 'Debate Eleitoral Histórico' });

    render(
      <NewsletterModal
        isOpen={true}
        onClose={vi.fn()}
        currentDebate={{ id: 'deb-abc', title: 'Debate Eleitoral Histórico' }}
      />
    );

    expect(screen.getByText(/Interesses rastreados automaticamente:/i)).toBeInTheDocument();
    expect(screen.getByText(/Debate Eleitoral Histórico/i)).toBeInTheDocument();
  });

  it('formats WhatsApp phone number with Brazilian mask while typing', () => {
    render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

    const phoneInput = screen.getByPlaceholderText('(11) 98765-4321') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '11988887777' } });

    expect(phoneInput.value).toBe('(11) 98888-7777');
  });

  it('submits form successfully and displays success message', async () => {
    const subscribeSpy = vi.spyOn(newsletterApi, 'subscribeToNewsletter').mockResolvedValueOnce({
      success: true
    });

    render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

    const phoneInput = screen.getByPlaceholderText('(11) 98765-4321');
    fireEvent.change(phoneInput, { target: { value: '11999998888' } });

    const submitBtn = screen.getByRole('button', { name: /confirmar inscrição/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(subscribeSpy).toHaveBeenCalled();
      expect(screen.getByText(/Inscrição Confirmada com Sucesso!/i)).toBeInTheDocument();
    });
  });

  it('displays error message when subscription fails', async () => {
    vi.spyOn(newsletterApi, 'subscribeToNewsletter').mockResolvedValueOnce({
      success: false,
      error: 'Erro de validação do número'
    });

    render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

    const phoneInput = screen.getByPlaceholderText('(11) 98765-4321');
    fireEvent.change(phoneInput, { target: { value: '11999998888' } });

    const submitBtn = screen.getByRole('button', { name: /confirmar inscrição/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Erro de validação do número/i)).toBeInTheDocument();
    });
  });
});
