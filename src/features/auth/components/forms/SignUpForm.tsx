// src/features/auth/components/forms/SignUpForm.tsx
import React, { useState } from 'react';
import { Heart, Mail, Lock, Check, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '../../lib/authAPI';
import { validations } from '../../utils/validations';
import ReCAPTCHA from '@/components/ui/ReCAPTCHA';

interface SignUpFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  recaptchaToken: string | null;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  onClose,
  onSwitchToLogin,
  onSuccess
}) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    recaptchaToken: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [] as string[]
  });

  // ✅ Validaciones en tiempo real
  const validateField = (name: string, value: string | boolean) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = 'El email es obligatorio';
        } else if (!validations.email(value as string)) {
          newErrors.email = 'Debe ser un email institucional @unipamplona.edu.co';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es obligatoria';
          setPasswordValidation({ isValid: false, errors: [] });
        } else {
          const validation = validations.password(value as string);
          setPasswordValidation(validation);
          if (validation.isValid) {
            delete newErrors.password;
          } else {
            newErrors.password = 'La contraseña no cumple los requisitos';
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'acceptTerms':
        if (!value) {
          newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
        } else {
          delete newErrors.acceptTerms;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (field: keyof SignUpFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (typeof value === 'string') {
      validateField(field, value);
    }
  };

  // ✅ Validación completa del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validations.email(formData.email)) {
      newErrors.email = 'Debe ser un email institucional @unipamplona.edu.co';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'La contraseña no cumple los requisitos';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    if (!formData.recaptchaToken) {
      newErrors.recaptcha = 'Debes completar el captcha';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Registrar usuario en el backend
      const response = await authAPI.register({
        email: formData.email,
        contrasena: formData.password,
        recaptcha_token: formData.recaptchaToken!,
        tyc: formData.acceptTerms
      });

      toast({
        title: "¡Registro exitoso!",
        description: "Se ha enviado un código de verificación a tu email",
      });

      // ✅ Redirigir a verificación de email
      onSuccess();

    } catch (error: any) {
      console.error('Error en registro:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Error al crear la cuenta. Por favor, intenta nuevamente.';

      // ✅ Manejo específico de errores comunes
      if (error.response?.status === 409) {
        setErrors({ email: 'Este email ya está registrado' });
        toast({
          title: "Email ya registrado",
          description: "Este correo electrónico ya tiene una cuenta. ¿Quieres iniciar sesión?",
          variant: "destructive",
          action: (
            <button 
              onClick={onSwitchToLogin}
              className="bg-white text-[#E93923] px-3 py-1 rounded text-sm font-medium"
            >
              Iniciar Sesión
            </button>
          )
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto overflow-hidden">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img 
          src="/src/assets/logo-login.webp" 
          alt="CUPIDO Logo" 
          className="w-14 h-13 object-contain"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1 leading-tight">
          Crear Cuenta
        </h2>
        <p className="text-gray-600 text-sm">
          Únete a la comunidad universitaria
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Campo Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico Institucional *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E93923] focus:border-transparent transition-colors duration-200 text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="usuario@unipamplona.edu.co"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
            <p className="text-xs text-gray-500">
              Solo se permiten emails institucionales de la Universidad de Pamplona
            </p>
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Contraseña *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E93923] focus:border-transparent transition-colors duration-200 text-sm ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}

            {/* Requisitos de contraseña */}
            {formData.password && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-1">Requisitos de seguridad:</p>
                <div className="space-y-0.5">
                  {[
                    { label: 'Mínimo 8 caracteres', met: formData.password.length >= 8 },
                    { label: 'Una letra mayúscula', met: /[A-Z]/.test(formData.password) },
                    { label: 'Una letra minúscula', met: /[a-z]/.test(formData.password) },
                    { label: 'Un número', met: /\d/.test(formData.password) },
                    { label: 'Un carácter especial', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) }
                  ].map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      {req.met ? (
                        <Check className="w-3 h-3 text-green-500 mr-1.5 flex-shrink-0" />
                      ) : (
                        <div className="w-3 h-3 border border-gray-300 rounded mr-1.5 flex-shrink-0" />
                      )}
                      <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E93923] focus:border-transparent transition-colors duration-200 text-sm ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Checkbox Términos y Condiciones */}
          <div className="pt-2">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-[#E93923] focus:ring-[#E93923] flex-shrink-0"
                disabled={isLoading}
              />
              <span className="text-xs text-gray-700 leading-relaxed">
                Acepto los{' '}
                <button
                  type="button"
                  className="text-[#E93923] hover:text-[#d1321f] underline"
                  onClick={() => {/* Abrir modal de términos */}}
                >
                  Términos y Condiciones
                </button>{' '}
                y la{' '}
                <button
                  type="button"
                  className="text-[#E93923] hover:text-[#d1321f] underline"
                  onClick={() => {/* Abrir modal de privacidad */}}
                >
                  Política de Privacidad
                </button>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>
            )}
          </div>

          {/* reCAPTCHA */}
          <div className="pt-3">
            <div className="flex justify-center transform scale-90 origin-center">
              <ReCAPTCHA
                onChange={(token) => setFormData(prev => ({ ...prev, recaptchaToken: token }))}
                onExpired={() => setFormData(prev => ({ ...prev, recaptchaToken: null }))}
              />
            </div>
            {errors.recaptcha && (
              <p className="text-red-500 text-xs mt-1 text-center">{errors.recaptcha}</p>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creando cuenta...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Crear cuenta
              </>
            )}
          </button>

          {/* Enlace a login */}
          <div className="mt-3 text-center">
            <span className="text-gray-600 text-xs">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#E93923] hover:text-[#d1321f] font-semibold underline transition-colors"
                disabled={isLoading}
              >
                Iniciar Sesión
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
