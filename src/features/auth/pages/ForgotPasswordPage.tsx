import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '../lib/authAPI';
import { validations } from '../utils/validations';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // ✅ Obtener email prellenado si viene de login
  useEffect(() => {
    const { prefillEmail } = location.state || {};
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [location.state]);

  // ✅ Handler para cerrar la página
  const handleClose = () => {
    navigate('/');
  };

  // ✅ Handler para enviar código de recuperación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar email
    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    if (!validations.email(email)) {
      setError('Por favor ingresa un email institucional válido (@unipamplona.edu.co)');
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Enviar solicitud de recuperación
      await authAPI.resetPasswordRequest({ email });
      
      toast({
        title: "Código enviado",
        description: "Se ha enviado un código de verificación a tu email institucional.",
      });

      setIsEmailSent(true);

      // ✅ Redirigir a verificación después de 2 segundos
      setTimeout(() => {
        navigate('/auth/verify-email', {
          state: { 
            email, 
            from: 'password-reset'
          }
        });
      }, 2000);

    } catch (error: any) {
      console.error('Error solicitando recuperación:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Error al enviar el código de recuperación. Por favor, intenta nuevamente.';

      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handler para reenviar (en caso de necesitarlo)
  const handleResend = async () => {
    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authAPI.resetPasswordRequest({ email });
      
      toast({
        title: "Código reenviado",
        description: "Se ha enviado un nuevo código de verificación a tu email.",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                          'Error al reenviar el código. Por favor, intenta nuevamente.';
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/api/placeholder/1920/1080')" // Reemplaza con tu imagen de fondo
      }}
    >
      <div className="w-full max-w-md">
        {/* Tarjeta principal con fondo translúcido */}
        <div className="bg-white/70 rounded-2xl p-8 shadow-xl backdrop-blur-sm border border-white/20">
          
          {/* Encabezado con el texto exacto de la imagen */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Recuperar Contraseña
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Ingresos únicos descritos como métodos de recuperación.
            </p>
          </div>


          {/* Contenido Principal */}
          {isEmailSent ? (
            // ✅ Estado: Código enviado
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  ¡Código Enviado!
                </h3>
                <p className="text-gray-600 mb-4">
                  Se ha enviado un código de verificación a:
                </p>
                <p className="font-semibold text-gray-800 bg-white/50 p-3 rounded-lg border border-gray-200">
                  {email}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Redirigiendo a verificación...
                </p>
                
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-[#E93923] hover:text-[#d1321f] text-sm underline disabled:opacity-50"
                >
                  {isLoading ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
                </button>
              </div>
            </div>
          ) : (
            // ✅ Estado: Formulario de solicitud
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico Institucional *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E93923] bg-white/70 ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="usuario@unipamplona.edu.co"
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Debe ser un email institucional de la Universidad de Pamplona
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="flex-1 bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Código'}
                </button>
              </div>
            </form>
          )}

          {/* Enlace de volver */}
          <div className="mt-6 text-center">
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              ← Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;