// src/features/auth/index.ts
// Exportaciones públicas del feature auth
export { default as AuthModal } from './components/AuthModal';
export { default as AuthRoutes } from './routes/authRoutes';

// Exportaciones de páginas
export { default as EmailVerificationPage } from './pages/EmailVerificationPage';
export { default as CompleteProfilePage } from './pages/CompleteProfilePage';
export { default as ForgotPasswordPage } from './pages/ForgotPasswordPage';
export { default as ResetPasswordPage } from './pages/ResetPasswordPage';

// Exportaciones de componentes
export { default as LoginForm } from './components/forms/LoginForm';
export { default as SignUpForm } from './components/forms/SignUpForm';

// Exportaciones de hooks
export { useAuth } from './hooks/useAuth';
export { useEmailVerification } from './hooks/useEmailVerification';

// Exportaciones de tipos
export type { User, AuthState, LoginCredentials } from './types';