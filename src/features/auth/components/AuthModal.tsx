// src/features/auth/components/AuthModal.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './forms/LoginForm';
import SignUpForm from './forms/SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Handlers para redirigir a páginas
  const handleLoginNeedsVerification = () => {
    onClose();
    navigate('/auth/verify-email', { state: { from: 'login' } });
  };

  const handleLoginNeedsProfile = () => {
    onClose();
    navigate('/auth/complete-register', { state: { from: 'login' } });
  };

  const handleRegisterSuccess = () => {
    onClose();
    navigate('/auth/verify-email', { state: { from: 'register' } });
  };

  const handleForgotPassword = () => {
    onClose();
    navigate('/auth/forgot-password');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-[439px] h-[680px] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-1 rounded-full hover:bg-rose-300 transition-colors z-10"
          aria-label="Cerrar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenido del modal */}
        <div className="h-full flex flex-col p-5">
          {mode === 'login' ? (
            <LoginForm
              onClose={onClose}
              onSwitchToRegister={() => setMode('register')}
              onNeedsVerification={handleLoginNeedsVerification}
              onNeedsProfile={handleLoginNeedsProfile}
              onForgotPassword={handleForgotPassword}
            />
          ) : (
            <SignUpForm
              onClose={onClose}
              onSwitchToLogin={() => setMode('login')}
              onSuccess={handleRegisterSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;