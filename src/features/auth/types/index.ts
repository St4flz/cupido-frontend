// src/features/auth/types/index.ts
export interface User {
    id: string;
    email: string;
    nombres?: string;
    apellidos?: string;
    estado: '0' | '1' | '2'; // 0: activa, 1: pendiente perfil, 2: completa
    should_complete_profile?: boolean;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    email: string;
    contrasena: string;
    recaptcha_token: string;
  }
  
  export interface RegisterCredentials {
    email: string;
    contrasena: string;
    recaptcha_token: string;
    tyc: boolean;

  }
  
  export interface ProfileData {
    nombres: string;
    apellidos: string;
    genero_id: number;
    fechanacimiento: string;
    descripcion: string;
  }
  
  export interface PasswordResetData {
    email: string;
    token: string;
    nueva_contrasena: string;
  }