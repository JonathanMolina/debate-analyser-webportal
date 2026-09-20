import { useState, useMemo, FormEvent } from 'react';
import type { NewsletterContactType, ViewedDebateMetadata } from '../types/newsletter.types';
import { subscribeToNewsletter } from '../api/newsletterApi';
import { getViewedDebates, buildNewsletterMetadata } from '../utils/debateViewTracker';

export interface UseNewsletterFormOptions {
  onSuccess?: () => void;
  currentDebate?: {
    id: string;
    title: string;
  };
}

export const formatPhoneNumber = (value: string): string => {
  if (value.startsWith('+')) {
    return value.replace(/[^\d+ ]/g, '');
  }
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const useNewsletterForm = (options?: UseNewsletterFormOptions) => {
  const [contactType, setContactType] = useState<NewsletterContactType>('whatsapp');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Carrega histórico de debates vistos pelo usuário
  const viewedDebates = useMemo<ViewedDebateMetadata[]>(() => {
    return getViewedDebates();
  }, [isSuccess]); // Recarrega se necessário

  const handleWhatsappChange = (val: string) => {
    setWhatsapp(formatPhoneNumber(val));
  };

  const resetForm = () => {
    setEmail('');
    setWhatsapp('');
    setName('');
    setIsLoading(false);
    setIsSuccess(false);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const metadata = buildNewsletterMetadata(options?.currentDebate);

      const result = await subscribeToNewsletter({
        contactType,
        email: contactType === 'email' || contactType === 'both' ? email : undefined,
        whatsapp: contactType === 'whatsapp' || contactType === 'both' ? whatsapp : undefined,
        name: name.trim() || undefined,
        metadata
      });

      if (result.success) {
        setIsSuccess(true);
        if (options?.onSuccess) {
          options.onSuccess();
        }
      } else {
        setErrorMessage(result.error || 'Erro ao registrar sua inscrição. Tente novamente.');
      }
    } catch {
      setErrorMessage('Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contactType,
    setContactType,
    email,
    setEmail,
    whatsapp,
    setWhatsapp: handleWhatsappChange,
    name,
    setName,
    isLoading,
    isSuccess,
    errorMessage,
    viewedDebates,
    currentDebate: options?.currentDebate,
    handleSubmit,
    resetForm
  };
};
