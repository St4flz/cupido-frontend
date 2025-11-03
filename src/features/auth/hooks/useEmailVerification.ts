import { useState, useEffect, useRef } from 'react';
import { authAPI } from '../lib/authAPI';

interface UseEmailVerificationResult {
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  resendCode: (email: string) => Promise<{ success: boolean; error?: any }>;
  isResending: boolean;
  countdown: number;
}

export const useEmailVerification = (initialDelay: number = 60): UseEmailVerificationResult => {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  const verifyCode = async (email: string, code: string) => {
    try {
      const response = await authAPI.verifyEmail({ email, code });
      return { success: true, data: response };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  const resendCode = async (email: string) => {
    setIsResending(true);
    try {
      await authAPI.resendCode({ email });
      setCountdown(initialDelay);
      return { success: true };
    } catch (error: any) {
      return { success: false, error };
    } finally {
      setIsResending(false);
    }
  };

  return { verifyCode, resendCode, isResending, countdown };
};
