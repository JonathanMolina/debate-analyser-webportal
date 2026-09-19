import { describe, it, expect, beforeEach } from 'vitest';
import { globalRateLimiter } from '../rateLimiter';

describe('ClientRateLimiter', () => {
  beforeEach(() => {
    globalRateLimiter.reset();
  });

  it('deve permitir requisições normais dentro da janela de taxa', () => {
    expect(globalRateLimiter.allowRequest()).toBe(true);
    expect(globalRateLimiter.allowRequest()).toBe(true);
  });

  it('deve contabilizar requisições restantes corretamente', () => {
    const initial = globalRateLimiter.getRemainingRequests();
    globalRateLimiter.allowRequest();
    expect(globalRateLimiter.getRemainingRequests()).toBe(initial - 1);
  });
});
