// src/features/auth/hooks/useAuth.ts
import { useState } from 'react';
import { authAPI } from '../lib/authAPI';
import type { LoginCredentials, RegisterCredentials, User } from '../types';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(credentials);
      
      if (response.access_token) {
        setUser(response.user);
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      
      return response;
    } catch (err: any) {
      // Extraer mensaje de error específico del backend
      let errorMessage = 'Error al iniciar sesión';

      if (err.response?.data) {
        // Si es un error de validación del serializer (400), mostrar el mensaje específico
        if (err.response.status === 400 && err.response.data) {
          // Los errores de validación vienen en formato de objeto {campo: [mensaje]}
          const validationErrors = err.response.data;
          if (typeof validationErrors === 'object') {
            // Tomar el primer error encontrado
            const firstError = Object.values(validationErrors)[0];
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0];
            } else if (typeof firstError === 'string') {
              errorMessage = firstError;
            }
          } else if (typeof validationErrors === 'string') {
            errorMessage = validationErrors;
          }
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      console.error('Login error details:', err.response?.data);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(credentials);
      return response;
    } catch (err: any) {
      // Extraer mensaje de error específico del backend para registro
      let errorMessage = 'Error al registrar usuario';

      if (err.response?.data) {
        // Si es un error de validación del serializer (400), mostrar el mensaje específico
        if (err.response.status === 400 && err.response.data) {
          // Los errores de validación vienen en formato de objeto {campo: [mensaje]}
          const validationErrors = err.response.data;
          if (typeof validationErrors === 'object') {
            // Tomar el primer error encontrado
            const firstError = Object.values(validationErrors)[0];
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0];
            } else if (typeof firstError === 'string') {
              errorMessage = firstError;
            }
          } else if (typeof validationErrors === 'string') {
            errorMessage = validationErrors;
          }
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }

        // Manejo específico de errores comunes de registro
        if (err.response.status === 409) {
          errorMessage = 'Este correo electrónico ya está registrado';
        }
      }

      console.error('Register error details:', err.response?.data);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  const checkAuth = async () => {
    try {
      const userProfile = await authAPI.getUserProfile();
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      logout();
      throw error;
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth
  };
};