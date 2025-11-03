// Home.tsx - VERSIÓN ACTUALIZADA CON NUEVO AUTH MODULAR
import { useEffect, useState } from 'react';
import { Header } from '@/features/home/components/Header';
import Preloader from '@/features/home/components/Preloader';
import HeroSection from '@/features/home/components/HeroSection';
import FeaturesSection from '@/features/home/components/FeaturesSection';
import HowItWorksSection from '@/features/home/components/HowItWorksSection';
import SafetySection from '@/features/home/components/SafetySection';
import TestimonialsSection from '@/features/home/components/TestimonialsSection';
import FAQSection from '@/features/home/components/FAQSection';
import CTAFinalSection from '@/features/home/components/CTAFinalSection';
import Footer from '@/features/home/components/Footer';
import ThemeTransitionOverlay from '@/components/ui/ThemeTransitionOverlay';
import ScrollToTopButton from '@/features/home/components/ScrollToTopButton';
import { useAppStore } from '@/store/appStore';
import { AuthModal } from '@/features/auth'; // ✅ Importación del nuevo AuthModal
import Dashboard from '@/features/dashboard/Dashboard';

const Index = () => {
  const {
    showPreloader,
    hidePreloader,
    theme,
    setTheme,
    isTransitioning,
    setIsTransitioning,
    openLogin,
    openSigUp,
    authModal,
    closeModals,
  } = useAppStore();

  // ✅ Estado local para controlar el AuthModal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ✅ Efecto para sincronizar el store con el estado local del modal
  useEffect(() => {
    if (authModal === 'openLogin') {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    } else if (authModal === 'openSigUp') {
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
    } else if (authModal === null) {
      setIsAuthModalOpen(false);
    }
  }, [authModal]);

  const handleThemeChange = (newTheme: string) => {
    if (newTheme !== theme) {
      setIsTransitioning(true);
      setTimeout(() => {
        setTheme(newTheme as 'femenino' | 'masculino');
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
    }
  };

  // ✅ Handler para cerrar el AuthModal
  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    closeModals(); // También limpia el estado del store
  };

  // ✅ Handler para cambiar entre login y registro dentro del modal
  const handleSwitchAuthMode = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // ✅ Handlers para los botones de la página (opcional - mantienen compatibilidad)
  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
    openLogin(); // Para mantener compatibilidad con store existente
  };

  const handleOpenRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
    openSigUp(); // Para mantener compatibilidad con store existente
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {showPreloader && <Preloader onComplete={hidePreloader} />}
      {isTransitioning && <ThemeTransitionOverlay theme={theme} />}

      <div className={showPreloader || isTransitioning ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <Header
          onThemeChange={handleThemeChange}
          onLoginClick={handleOpenLogin}
          onSignupClick={handleOpenRegister}
        />
        <main>
          <HeroSection
            onLoginClick={() => handleSwitchAuthMode('login')}
            onSignupClick={() => handleSwitchAuthMode('register')}
          />
          <FeaturesSection />
          <HowItWorksSection />
          <SafetySection />
          <TestimonialsSection />
          <FAQSection />
          <CTAFinalSection onSignupClick={handleOpenRegister} />
        </main>
        <Footer />
      </div>

      {/* ✅ NUEVO AUTH MODAL UNIFICADO */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialMode={authModalMode}
      />

      {/* ✅ Mantener Dashboard (si es necesario) */}
      {authModal === 'dashboard' && (
        <Dashboard />
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default Index;