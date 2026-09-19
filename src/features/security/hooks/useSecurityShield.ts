import { useState, useCallback } from 'react';
import { globalRateLimiter } from '../utils/rateLimiter';

export const useSecurityShield = () => {
  const [isVerificationRequired, setIsVerificationRequired] = useState(false);
  const [honeypotValue, setHoneypotValue] = useState('');

  const checkAllowed = useCallback((): boolean => {
    // 1. Se o honeypot foi preenchido por um bot
    if (honeypotValue.trim() !== '') {
      setIsVerificationRequired(true);
      return false;
    }

    // 2. Se o limitador de requisições estourou a janela
    if (!globalRateLimiter.allowRequest()) {
      setIsVerificationRequired(true);
      return false;
    }

    return true;
  }, [honeypotValue]);

  const handlePassedVerification = useCallback(() => {
    globalRateLimiter.reset();
    setHoneypotValue('');
    setIsVerificationRequired(false);
  }, []);

  return {
    isVerificationRequired,
    honeypotValue,
    setHoneypotValue,
    checkAllowed,
    handlePassedVerification
  };
};
