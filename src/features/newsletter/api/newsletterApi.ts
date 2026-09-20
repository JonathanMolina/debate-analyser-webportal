import { supabase, isSupabaseConfigured } from '@/app/supabase/client';
import type {
  NewsletterSubscriptionInput,
  NewsletterSubscriptionResult
} from '../types/newsletter.types';
import { sanitizeText } from '@/features/security/utils/sanitize';
import { globalRateLimiter } from '@/features/security/utils/rateLimiter';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_MIN_DIGITS = 8;
const PHONE_MAX_DIGITS = 16;

/**
 * Valida se um número de telefone/WhatsApp possui dígitos suficientes.
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= PHONE_MIN_DIGITS && digitsOnly.length <= PHONE_MAX_DIGITS;
};

/**
 * Valida formato de e-mail.
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim()) && email.trim().length <= 150;
};

/**
 * Registra a inscrição na Newsletter (E-mail e/ou WhatsApp) junto aos metadados
 * de histórico de debates assistidos no Supabase.
 */
export const subscribeToNewsletter = async (
  input: NewsletterSubscriptionInput
): Promise<NewsletterSubscriptionResult> => {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Servidor temporariamente indisponível.' };
  }

  // Verificação de taxa de requisições anti-abuso
  if (!globalRateLimiter.allowRequest()) {
    return {
      success: false,
      error: 'Muitas tentativas em pouco tempo. Aguarde um minuto antes de tentar novamente.'
    };
  }

  const cleanName = input.name ? sanitizeText(input.name.trim()).slice(0, 100) : null;
  const cleanEmail = input.email ? sanitizeText(input.email.trim().toLowerCase()).slice(0, 150) : null;
  const cleanWhatsapp = input.whatsapp ? sanitizeText(input.whatsapp.trim()).slice(0, 30) : null;

  // Validação: Ao menos um canal de contato válido deve ser fornecido
  const wantsEmail = input.contactType === 'email' || input.contactType === 'both';
  const wantsWhatsapp = input.contactType === 'whatsapp' || input.contactType === 'both';

  if (wantsEmail && (!cleanEmail || !isValidEmail(cleanEmail))) {
    return { success: false, error: 'Por favor, informe um endereço de e-mail válido.' };
  }

  if (wantsWhatsapp && (!cleanWhatsapp || !isValidPhoneNumber(cleanWhatsapp))) {
    return {
      success: false,
      error: 'Por favor, informe um número de WhatsApp válido com DDD (ex: 11 98765-4321).'
    };
  }

  if (!cleanEmail && !cleanWhatsapp) {
    return {
      success: false,
      error: 'Informe pelo menos um e-mail ou número de WhatsApp para se inscrever.'
    };
  }

  try {
    const { error } = await supabase.from('newsletter_subscriptions').insert({
      contact_type: input.contactType,
      email: cleanEmail,
      whatsapp: cleanWhatsapp,
      name: cleanName,
      status: 'active',
      metadata: input.metadata || {}
    });

    if (error) {
      // Se houver conflito de duplicidade ou violação de checagem
      return {
        success: false,
        error: 'Não foi possível registrar sua inscrição. Verifique os dados e tente novamente.'
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: 'Erro inesperado ao processar sua inscrição. Tente novamente mais tarde.'
    };
  }
};
