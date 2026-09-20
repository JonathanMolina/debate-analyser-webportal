import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  subscribeToNewsletter,
  isValidEmail,
  isValidPhoneNumber
} from '../newsletterApi';
import { supabase } from '@/app/supabase/client';

describe('newsletterApi validation helpers', () => {
  it('validates email addresses properly', () => {
    expect(isValidEmail('usuario@gmail.com')).toBe(true);
    expect(isValidEmail('teste.dev+sub@dominio.com.br')).toBe(true);
    expect(isValidEmail('invalido')).toBe(false);
    expect(isValidEmail('invalido@')).toBe(false);
    expect(isValidEmail('@dominio.com')).toBe(false);
    expect(isValidEmail('   ')).toBe(false);
  });

  it('validates phone numbers properly', () => {
    expect(isValidPhoneNumber('11987654321')).toBe(true);
    expect(isValidPhoneNumber('(11) 98765-4321')).toBe(true);
    expect(isValidPhoneNumber('+55 11 98765-4321')).toBe(true);
    expect(isValidPhoneNumber('12345')).toBe(false); // menos de 8 dígitos
    expect(isValidPhoneNumber('')).toBe(false);
  });
});

describe('subscribeToNewsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fails when email is invalid for email contact type', async () => {
    const result = await subscribeToNewsletter({
      contactType: 'email',
      email: 'not-an-email'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('e-mail válido');
  });

  it('fails when phone is invalid for whatsapp contact type', async () => {
    const result = await subscribeToNewsletter({
      contactType: 'whatsapp',
      whatsapp: '123'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('WhatsApp válido');
  });

  it('fails when both fields are empty', async () => {
    const result = await subscribeToNewsletter({
      contactType: 'email',
      email: ''
    });

    expect(result.success).toBe(false);
  });

  it('successfully submits valid email and metadata', async () => {
    const insertSpy = vi.spyOn(supabase, 'from').mockReturnValueOnce({
      insert: vi.fn().mockResolvedValue({ error: null })
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await subscribeToNewsletter({
      contactType: 'email',
      email: 'cidadao@exemplo.com',
      name: 'João Silva',
      metadata: {
        viewedDebates: [{ id: 'deb-1', title: 'Debate Teste', viewedAt: new Date().toISOString() }],
        subscribedAt: new Date().toISOString()
      }
    });

    expect(result.success).toBe(true);
    expect(insertSpy).toHaveBeenCalledWith('newsletter_subscriptions');
  });

  it('successfully submits valid whatsapp', async () => {
    vi.spyOn(supabase, 'from').mockReturnValueOnce({
      insert: vi.fn().mockResolvedValue({ error: null })
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await subscribeToNewsletter({
      contactType: 'whatsapp',
      whatsapp: '11987654321',
      name: 'Maria'
    });

    expect(result.success).toBe(true);
  });
});
