// src/features/auth/components/forms/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ReCAPTCHA from '@/components/ui/ReCAPTCHA';

interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
  onNeedsVerification: () => void;
  onNeedsProfile: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onClose,
  onSwitchToRegister,
  onNeedsVerification,
  onNeedsProfile,
  onForgotPassword
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setRecaptchaError('Debes completar el captcha');
      return;
    }

    try {
      const result = await login({ email, contrasena: password, recaptcha_token: recaptchaToken });

      // Manejar diferentes estados de cuenta
      const estadoCuenta = result.estadocuenta;

      // Estados que NO permiten login
      if (estadoCuenta === '-1' || estadoCuenta === '-2') {
        throw new Error('Tu cuenta ha sido suspendida o desactivada. Contacta al soporte.');
      }

      // Estados que permiten login y redirigen según el caso
      if (estadoCuenta === '1') {
        // Perfil incompleto - ir a completar registro
        onNeedsProfile();
      } else if (estadoCuenta === '0' || estadoCuenta === '3' || estadoCuenta === '2') {
        // Perfil completo - ir al dashboard
        onClose();
      } else {
        // Estado desconocido - ir al dashboard por defecto
        onClose();
      }
    } catch (error) {
      // El error ya está manejado en el hook
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img 
          src="/src/assets/logo-login.webp" 
          alt="CUPIDO Logo" 
          className="w-16 h-15 object-contain"
        />
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="text-black text-xl font-normal font-['Poppins'] leading-tight">
          Iniciar Sesión
        </div>
        <div className="text-black text-2xl font-medium font-['Poppins'] mt-2 leading-tight">
          Bienvenido
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
        <div className="space-y-6 flex-1">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E93923] focus:border-transparent transition-colors duration-200"
              placeholder="usuario@unipamplona.edu.co"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E93923] focus:border-transparent transition-colors duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* reCAPTCHA */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="transform scale-90">
              <ReCAPTCHA
                onChange={(token) => {
                  setRecaptchaToken(token);
                  setRecaptchaError('');
                }}
                onExpired={() => {
                  setRecaptchaToken(null);
                  setRecaptchaError('El captcha ha expirado, por favor complétalo nuevamente');
                }}
              />
            </div>
            {recaptchaError && (
              <p className="text-red-500 text-sm text-center">{recaptchaError}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[#E93923] hover:text-[#d1321f] text-sm underline transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Action Buttons - Se mantiene en la parte inferior */}
        <div className="pt-6 space-y-4">
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !recaptchaToken}
            className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          {/* Switch to Register */}
          <div className="text-center pt-2">
            <span className="text-gray-600 text-sm">
              ¿No tienes una cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-[#E93923] hover:text-[#d1321f] font-semibold underline transition-colors duration-200"
              >
                Regístrate
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;