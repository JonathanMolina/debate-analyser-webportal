import { describe, it, expect } from 'vitest';
import { sanitizeText, sanitizeSearchQuery, sanitizeId, isSafeUrl } from '../sanitize';

describe('Security Sanitization Utils', () => {
  it('deve limpar tags maliciosas <script> e eventos onerror', () => {
    const maliciousInput = '<script>alert("hack")</script><img src=x onerror=alert(1)>Texto Seguro';
    const sanitized = sanitizeText(maliciousInput);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).toContain('Texto Seguro');
  });

  it('deve remover caracteres comuns de SQL Injection na busca', () => {
    const maliciousQuery = "' OR '1'='1; DROP TABLE debaters;--";
    const sanitized = sanitizeSearchQuery(maliciousQuery);
    expect(sanitized).not.toContain("'");
    expect(sanitized).not.toContain(";");
    expect(sanitized).toBe('OR 1=1 DROP TABLE debaters--');
  });

  it('deve preservar identificadores com underscore e hífen em sanitizeId', () => {
    const validJobId = 'job_1789841795615_mbuvp';
    expect(sanitizeId(validJobId)).toBe('job_1789841795615_mbuvp');

    const maliciousId = 'job_12345\'; DROP TABLE debate_jobs;--';
    expect(sanitizeId(maliciousId)).toBe('job_12345DROPTABLEdebate_jobs--');
  });

  it('deve validar URLs seguras e rejeitar protocolos perigosos como javascript:', () => {
    expect(isSafeUrl('https://youtube.com/watch?v=123')).toBe(true);
    expect(isSafeUrl('http://meusite.com')).toBe(true);
    expect(isSafeUrl('javascript:alert(document.cookie)')).toBe(false);
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });
});
