// src/features/auth/pages/CompleteProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CompleteRegister from '../components/modals/CompleteRegister';
import { authAPI } from '../lib/authAPI';
import { useAppStore } from '@/store/appStore';

interface ProfileData {
  nombres: string;
  apellidos: string;
  genero_id: number;
  fechanacimiento: string;
  descripcion: string;
}

const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAppStore();

  const { 
    email,
    from,
    userData,
    verificationData 
  } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<ProfileData> | null>(null);

  useEffect(() => {
    if (userData) {
      setInitialData({
        nombres: userData.nombres || '',
        apellidos: userData.apellidos || '',
        genero_id: userData.genero_id || 0,
        fechanacimiento: userData.fechanacimiento || '',
        descripcion: userData.descripcion || ''
      });
    }
  }, [userData]);

  const handleClose = () => {
    if (from === 'register') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      const { logout } = useAppStore.getState();
      logout();
    }
    navigate('/');
  };

  const handleSubmit = async (profileData: ProfileData) => {
    setIsLoading(true);

    try {
      const response = await authAPI.updateProfile(profileData);
      
      toast({
        title: "¡Perfil completado!",
        description: "Tu perfil ha sido actualizado correctamente.",
      });

      login(response.user);

      try {
        const userProfile = await authAPI.getUserProfile();
        
        if (userProfile.estado === '2' || !userProfile.should_complete_profile) {
          navigate('/dashboard', { 
            replace: true,
            state: { 
              welcomeMessage: '¡Bienvenido a CUPIDO! Tu perfil está completo.' 
            }
          });
        } else {
          toast({
            title: "Perfil actualizado",
            description: "Tu información ha sido guardada, pero aún faltan algunos datos.",
            variant: "default"
          });
          navigate('/dashboard');
        }
      } catch (profileError) {
        console.error('Error verificando perfil:', profileError);
        navigate('/dashboard');
      }

    } catch (error: unknown) {
      console.error('Error completo:', error);

      let errorMessage = 'Error al guardar tu perfil. Por favor, intenta nuevamente.';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string; message?: string }; status?: number } };
        errorMessage = axiosError.response?.data?.error ||
                      axiosError.response?.data?.message ||
                      errorMessage;

        if (axiosError.response?.status === 401) {
          toast({
            title: "Sesión expirada",
            description: "Por favor, inicia sesión nuevamente.",
            variant: "destructive"
          });
          handleClose();
          return;
        }
      }

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
    <div className="min-h-screen bg-[#F2D6CD] flex flex-col lg:flex-row">
      {/* Lado izquierdo - Formulario compacto */}
      <div className="flex-1 flex items-center justify-center p-3 lg:p-6">
        <div className="w-full max-w-md">
          {/* Logo compacto */}
          <div className="flex justify-center mb-3">
            <img 
              src="/src/assets/logo-login.webp" 
              alt="CUPIDO Logo" 
              className="w-12 h-11 object-contain"
            />
          </div>

          {/* Título compacto */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-black mb-1 font-['Poppins']">
              Completa tu registro
            </h1>
            <p className="text-xs text-black font-normal font-['Poppins'] leading-tight">
              Cuéntanos un poco sobre ti para personalizar tu experiencia.
            </p>
          </div>

          {/* Contenedor del formulario compacto */}
          <div className="bg-white/90 rounded-xl p-4 shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] border border-white/20">
            <CompleteRegister
              isOpen={true}
              onSubmit={handleSubmit}
              onClose={handleClose}
              isSubmitting={isLoading}
              initialData={initialData}
            />
          </div>

          {/* Botón volver compacto */}
          <div className="mt-3 text-center">
            <button
              onClick={handleClose}
              className="text-[#E93923] hover:text-[#d1321f] text-xs underline transition-colors duration-200 font-['Poppins']"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
      
      {/* Lado derecho - Imagen decorativa */}
      <div className="lg:flex-1 relative min-h-[180px] lg:min-h-0">
        {/* Imagen para móvil compacta */}
        <div className="lg:hidden w-full h-40 relative">
          <img 
            src="/src/assets/flat-valentine-s-day-photocall-template-Photoroom-1.webp" 
            alt="Decoración CUPIDO" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* Imagen para desktop compacta */}
        <div className="hidden lg:block relative w-full h-full">
          <img
            src="/src/assets/image-completereg.webp"
            alt="Decoración CUPIDO"
            className="absolute right-0 bottom-0 h-[75vh] max-w-[85%] object-right-bottom object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;