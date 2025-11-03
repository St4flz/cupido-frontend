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
      const errorMessage = err.response?.data?.error || 'Error al iniciar sesión';
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
      const errorMessage = err.response?.data?.error || 'Error al registrar usuario';
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