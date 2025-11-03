// src/features/auth/routes/authRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import EmailVerificationPage from '../pages/EmailVerificationPage';
import CompleteProfilePage from '../pages/CompleteProfilePage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="verify-email" element={<EmailVerificationPage />} />
      <Route path="complete-register" element={<CompleteProfilePage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
};

export default AuthRoutes;