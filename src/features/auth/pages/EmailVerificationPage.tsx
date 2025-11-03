import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import EmailVerificationModal from '../components/modals/EmailVerificationModal';
import { useEmailVerification } from '../hooks/useEmailVerification';
import { authAPI } from '../lib/authAPI';

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // ✅ Obtener datos de la navegación
  const { 
    email, 
    from, 
    userData, 
    redirectTo = '/dashboard' 
  } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Hook personalizado para verificación de email
  const { 
    verifyCode, 
    resendCode, 
    isResending, 
    countdown 
  } = useEmailVerification();

  // ✅ Validar que tenemos el email necesario
  useEffect(() => {
    if (!email) {
      toast({
        title: "Error",
        description: "No se encontró información de email. Por favor, regresa e intenta nuevamente.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [email, navigate, toast]);

  // ✅ Handler para cerrar la página
  const handleClose = () => {
    navigate('/');
  };

  // ✅ Handler para verificar el código CON MEJORAS DE SEGURIDAD
  const handleVerify = async (code: string) => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email no disponible para verificación",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Verificar el código con el backend
      const response = await verifyCode(email, code);
      
      toast({
        title: "¡Email verificado!",
        description: "Tu dirección de email ha sido verificada correctamente.",
      });

      // ✅ FLUJO MEJORADO - Verificar creación real de cuenta
      if (from === 'register') {
        // 🔐 VERIFICACIÓN CRÍTICA: Confirmar que el usuario fue creado
        try {
          // Intentar obtener el token de autenticación
          await authAPI.getUserProfile();
          
          // Si llegamos aquí, el usuario existe y está autenticado
          // Redirigir a completar perfil
          navigate('/auth/complete-register', {
            state: {
              email,
              from: 'register',
              verificationData: response
            }
          });
          
        } catch (profileError) {
          console.error('Error verificando creación de usuario:', profileError);
          
          // ❌ EL USUARIO NO FUE CREADO - No permitir continuar
          toast({
            title: "Error en la creación de cuenta",
            description: "No se pudo crear tu cuenta. Por favor, contacta con soporte técnico.",
            variant: "destructive"
          });
          
          // Redirigir al inicio para que intente registrarse nuevamente
          setTimeout(() => {
            navigate('/');
          }, 3000);
          return;
        }
        
      } else if (from === 'login') {
        // Flujo de login: verificar estado de perfil
        try {
          const userProfile = await authAPI.getUserProfile();
          
          if (userProfile.estado === '1' || userProfile.should_complete_profile) {
            // Perfil incompleto: redirigir a completar perfil
            navigate('/auth/complete-register', {
              state: {
                userData: userProfile,
                from: 'login'
              }
            });
          } else {
            // Perfil completo: redirigir al dashboard
            navigate(redirectTo);
          }
        } catch (profileError) {
          console.error('Error obteniendo perfil:', profileError);
          navigate(redirectTo);
        }
      } else if (from === 'password-reset') {
        // Flujo de recuperación: redirigir a reset de contraseña
        navigate('/auth/reset-password', {
          state: { 
            email, 
            token: response.verification_token 
          }
        });
      } else {
        // Flujo genérico: redirigir al destino por defecto
        navigate(redirectTo);
      }

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Error al verificar el código. Por favor, intenta nuevamente.';
      
      setError(errorMessage);
      
      toast({
        title: "Error de verificación",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handler para reenviar código
  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "No se puede reenviar el código sin email",
        variant: "destructive"
      });
      return;
    }

    try {
      await resendCode(email);
      
      toast({
        title: "Código reenviado",
        description: "Se ha enviado un nuevo código de verificación a tu email.",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                          'Error al reenviar el código. Por favor, intenta nuevamente.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2D6CD]">
        <div className="bg-white/80 rounded-xl p-8 shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Información faltante
          </h2>
          <p className="text-gray-600 mb-6">
            No se encontró la información necesaria para la verificación.
          </p>
          <button
            onClick={handleClose}
            className="bg-[#E93923] text-white px-6 py-2 rounded-lg hover:bg-[#d1321f] transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/src/assets/background_verification.webp')"
      }}
    >
      <div className="w-full max-w-md">
        {/* Tarjeta principal con fondo translúcido */}
        <div className="bg-white/70 rounded-2xl p-8 shadow-xl backdrop-blur-sm border border-white/20">
          
          {/* Encabezado con el texto exacto de la imagen */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verificación de correo
            </h1>
            <p className="text-gray-600 mb-6">
              Ingresa el código que enviamos a tu correo
            </p>
            
            {/* Email del usuario */}
            <div className="bg-white/50 rounded-lg p-4 border border-gray-200 mb-6">
              <p className="text-sm text-gray-700">
                Código enviado a: <br />
                <span className="font-semibold text-gray-800">{email}</span>
              </p>
            </div>
          </div>

          {/* Modal de verificación */}
          <div className="bg-white/80 rounded-xl p-6 shadow-lg mb-6">
            <EmailVerificationModal
              isOpen={true}
              onClose={handleClose}
              onVerify={handleVerify}
              onResendCode={handleResendCode}
              userEmail={email}
              isSubmitting={isLoading}
              error={error}
              countdown={countdown}
              isResending={isResending}
            />
          </div>

          {/* Botón de reenviar código */}
          <div className="text-center mb-6">
            <button
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="text-[#E93923] hover:text-[#d1321f] text-sm font-medium underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `Reenviar en ${countdown}s` : '¿No recibiste el código? Reenviar'}
            </button>
          </div>

          {/* Botón de volver */}
          <div className="text-center">
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;