/**
 * Limitador de taxa baseado em janela deslizante (Sliding Window) para o cliente.
 * Previne requisições excessivas em loop ou flood automatizado.
 */
class ClientRateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 40, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  public allowRequest(): boolean {
    const now = Date.now();
    // Limpar timestamps fora da janela
    this.requests = this.requests.filter((timestamp) => now - timestamp < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  public getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter((timestamp) => now - timestamp < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  public reset(): void {
    this.requests = [];
  }
}

export const globalRateLimiter = new ClientRateLimiter(60, 60000); // 60 requisições por minuto
