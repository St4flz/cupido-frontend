// src/features/auth/components/modals/EmailVerificationModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, RotateCcw } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  onResendCode: () => void;
  userEmail: string;
  isSubmitting?: boolean;
  error?: string | null;
  countdown?: number;
  isResending?: boolean;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  onResendCode,
  userEmail,
  isSubmitting = false,
  error = null,
  countdown = 0,
  isResending = false
}) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ✅ Inicializar las referencias
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // ✅ Focus automático en el primer input al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // ✅ Reset del código al cerrar
  useEffect(() => {
    if (!isOpen) {
      setCode(['', '', '', '', '', '']);
    }
  }, [isOpen]);

  // ✅ Handler para cambio en inputs
  const handleChange = (index: number, value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericValue;
      setCode(newCode);

      // Auto-avance al siguiente input
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-envío cuando se completan los 6 dígitos
      if (newCode.every(digit => digit !== '') && index === 5) {
        handleSubmit(newCode.join(''));
      }
    }
  };

  // ✅ Handler para teclas (Backspace)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Retroceder al input anterior si está vacío
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // ✅ Handler para pegar código
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericCode = pastedData.replace(/[^0-9]/g, '').slice(0, 6);
    
    if (numericCode.length === 6) {
      const newCode = numericCode.split('');
      setCode(newCode);
      
      // Focus en el último input
      inputRefs.current[5]?.focus();
      
      // Auto-envío
      handleSubmit(numericCode);
    }
  };

  // ✅ Handler para enviar código
  const handleSubmit = (verificationCode?: string) => {
    const finalCode = verificationCode || code.join('');
    if (finalCode.length === 6) {
      onVerify(finalCode);
    }
  };

  // ✅ Handler para reenviar código
  const handleResend = () => {
    if (countdown === 0 && !isResending) {
      onResendCode();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-1 rounded-full hover:bg-rose-300 transition-colors z-10"
          aria-label="Cerrar"
          disabled={isSubmitting}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/src/assets/logo-login.webp" 
              alt="CUPIDO Logo" 
              className="w-16 h-16"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verificar Email
            </h2>
            <p className="text-gray-600 mb-4">
              Bienvenido a CUPIDO
            </p>
            
            {/* Icono de email */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-[#E93923]" />
              </div>
            </div>

            <p className="text-gray-700 mb-2">
              Verifica tu correo electrónico
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Ingresa el código de 6 dígitos que enviamos a:
            </p>
            
            <div className="bg-white/50 rounded-lg p-3">
              <p className="font-semibold text-gray-800 text-sm">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Inputs del código */}
          <div className="mb-8">
            <div className="flex justify-center space-x-3 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#E93923] focus:ring-2 focus:ring-[#E93923]/20 transition-all duration-200"
                  disabled={isSubmitting}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="text-center mb-4">
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg py-2 px-3">
                  {error}
                </p>
              </div>
            )}

            {/* Auto-submit info */}
            <p className="text-center text-sm text-gray-500">
              El código se enviará automáticamente cuando completes los 6 dígitos
            </p>
          </div>

          {/* Botón de reenviar */}
          <div className="text-center mb-6">
            <button
              onClick={handleResend}
              disabled={countdown > 0 || isResending || isSubmitting}
              className="inline-flex items-center text-[#E93923] hover:text-[#d1321f] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? 'Enviando...' : 
               countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar código'}
            </button>
          </div>

          {/* Botón de verificación manual */}
          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting || code.some(digit => digit === '')}
            className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Verificando...
              </>
            ) : (
              'Verificar Código'
            )}
          </button>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              ¿Problemas con la verificación?{' '}
              <button
                onClick={onClose}
                className="text-[#E93923] hover:text-[#d1321f] underline"
              >
                Volver al registro
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;