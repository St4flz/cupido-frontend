// src/features/auth/pages/ResetPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '../lib/authAPI';
import { validations } from '../utils/validations';
import PasswordField from '../components/forms/PasswordField';
import ConfirmPasswordField from '../components/forms/ConfirmPasswordField';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // ✅ Obtener datos de la navegación (desde EmailVerificationPage)
  const { 
    email, 
    token 
  } = location.state || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // ✅ Validar que tenemos la información necesaria
  useEffect(() => {
    if (!email || !token) {
      toast({
        title: "Error",
        description: "Información de verificación incompleta. Por favor, inicia el proceso nuevamente.",
        variant: "destructive"
      });
      navigate('/auth/forgot-password');
    }
  }, [email, token, navigate, toast]);

  // ✅ Handler para cerrar la página
  const handleClose = () => {
    navigate('/');
  };

  // ✅ Validar formulario
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validar nueva contraseña
    if (!newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña es obligatoria';
    } else {
      const passwordValidation = validations.password(newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = `La contraseña debe contener: ${passwordValidation.errors.join(', ')}`;
      }
    }

    // Validar confirmación
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handler para actualizar contraseña
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // ✅ Actualizar contraseña en el backend
      await authAPI.resetPasswordConfirm({
        email: email!,
        token: token!,
        nueva_contrasena: newPassword
      });

      toast({
        title: "¡Contraseña actualizada!",
        description: "Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión.",
      });

      // ✅ Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/', { 
          replace: true,
          state: { 
            showLogin: true,
            message: 'Tu contraseña ha sido actualizada. Inicia sesión con tu nueva contraseña.' 
          }
        });
      }, 2000);

    } catch (error: any) {
      console.error('Error actualizando contraseña:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Error al actualizar la contraseña. Por favor, intenta nuevamente.';

      setErrors({ general: errorMessage });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      // ✅ Manejo específico de token expirado
      if (error.response?.status === 400 || error.response?.data?.code === 'INVALID_TOKEN') {
        setTimeout(() => {
          navigate('/auth/forgot-password', {
            state: { 
              prefillEmail: email,
              error: 'El código de verificación ha expirado. Por favor, solicita uno nuevo.' 
            }
          });
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handler para limpiar errores al escribir
  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (errors.newPassword || errors.confirmPassword) {
      setErrors({});
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2D6CD]">
        <div className="bg-white/80 rounded-xl p-8 shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Información faltante
          </h2>
          <p className="text-gray-600 mb-6">
            No se encontró la información necesaria para restablecer la contraseña.
          </p>
          <button
            onClick={() => navigate('/auth/forgot-password')}
            className="bg-[#E93923] text-white px-6 py-2 rounded-lg hover:bg-[#d1321f] transition-colors"
          >
            Volver a recuperación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2D6CD] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Encabezado - Diseño similar a la imagen */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/src/assets/logo-login.webp" 
              alt="CUPIDO Logo" 
              className="w-16 h-16"
            />
          </div>
          
          {/* Título principal similar al diseño de la imagen */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Restablecer Contraseña
            </h1>
            <div className="bg-white/50 rounded-lg p-3 inline-block">
              <p className="text-sm text-gray-700">
                Para: <span className="font-semibold">{email}</span>
              </p>
            </div>
          </div>

          {/* Texto descriptivo similar al de la imagen */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 font-medium">
              PORQUE LA LIBRE CONTENIDA ABAJO DE DOS CRITÉRIOS NO SENTIRÁ EN 30% DE SU REPÚBLICA
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white/80 rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Sección de contraseña - Diseño similar a la imagen */}
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3 text-lg">
                  Nueva contraseña
                </h3>
                
                {/* Campo Nueva Contraseña */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Cantificar nuevos contraseños *
                  </label>
                  <PasswordField
                    value={newPassword}
                    onChange={handlePasswordChange}
                    showRequirements={false}
                    disabled={isLoading}
                    placeholder="Ingresa tu nueva contraseña"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-2">{errors.newPassword}</p>
                  )}
                </div>

                {/* Campo Confirmar Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Confirmar la nueva contraseña *
                  </label>
                  <ConfirmPasswordField
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    originalPassword={newPassword}
                    disabled={isLoading}
                    placeholder="Confirma tu nueva contraseña"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Información de metodología - Similar a la imagen */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                  La metodología de una dimensión de datos que se han mantenido al menos por el año después
                </h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Mínimo 8 caracteres</li>
                  <li>• Al menos una letra mayúscula</li>
                  <li>• Al menos una letra minúscula</li>
                  <li>• Al menos un número</li>
                  <li>• Al menos un carácter especial (!@#$%^&*)</li>
                </ul>
              </div>
            </div>

            {/* Botón de autorización - Similar al diseño de la imagen */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-lg"
              >
                {isLoading ? 'Actualizando...' : 'Autorizarse a continuación'}
              </button>
            </div>
          </form>
        </div>

        {/* Enlace para volver */}
        <div className="mt-6 text-center">
          <button
            onClick={handleClose}
            className="text-[#E93923] hover:text-[#d1321f] text-sm underline font-medium"
          >
            ← Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;