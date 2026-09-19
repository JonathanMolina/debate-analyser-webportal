import { supabase, isSupabaseConfigured } from '@/app/supabase/client';
import type { FeedbackInput } from '../types/feedback.types';
import { sanitizeText } from '@/features/security/utils/sanitize';
import { globalRateLimiter } from '@/features/security/utils/rateLimiter';

export const submitFeedback = async (
  input: FeedbackInput
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Servidor temporariamente indisponível.' };
  }

  // Verificar limitador de taxa para evitar flood de spam
  if (!globalRateLimiter.allowRequest()) {
    return {
      success: false,
      error: 'Muitas tentativas em pouco tempo. Por favor, aguarde um minuto antes de enviar novamente.'
    };
  }

  const sanitizedMessage = sanitizeText(input.message.trim());
  const sanitizedName = input.name ? sanitizeText(input.name.trim()).slice(0, 100) : null;
  const sanitizedEmail = input.email ? sanitizeText(input.email.trim()).slice(0, 150) : null;

  if (!sanitizedMessage) {
    return { success: false, error: 'A mensagem de feedback não pode estar vazia.' };
  }

  try {
    const { error } = await supabase.from('feedback').insert({
      category: input.category,
      message: sanitizedMessage,
      name: sanitizedName,
      email: sanitizedEmail,
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        timestamp: Date.now()
      }
    });

    if (error) {
      return { success: false, error: 'Falha ao salvar feedback. Tente novamente mais tarde.' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Erro inesperado ao enviar seu feedback. Tente novamente mais tarde.' };
  }
};
