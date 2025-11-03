// src/features/auth/hooks/useEmailVerification.ts
import { useState, useEffect } from 'react';
import { authAPI } from '../lib/authAPI';

export const useEmailVerification = () => {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer para reenvío
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const verifyCode = async (email: string, code: string) => {
    return await authAPI.verifyEmail({ email, code });
  };

  const resendCode = async (email: string) => {
    setIsResending(true);
    try {
      await authAPI.resendCode({email});
      setCountdown(60); // 60 segundos de espera
    } finally {
      setIsResending(false);
    }
  };

  return {
    verifyCode,
    resendCode,
    isResending,
    countdown
  };
};