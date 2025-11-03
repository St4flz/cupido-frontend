// src/features/auth/hooks/useFormSteps.ts
import { useState, useCallback } from 'react';

export type SignUpStep = 
  | 'initial'           // Formulario básico de email y contraseña
  | 'captcha'           // Verificación reCAPTCHA
  | 'email-verification' // Verificación de código por email
  | 'complete-register'  // Completar perfil con datos personales
  | 'completed';         // Registro exitoso

export interface FormStepsState {
  currentStep: SignUpStep;
  previousStep: SignUpStep | null;
  isTransitioning: boolean;
  stepHistory: SignUpStep[];
}

export interface UseFormStepsReturn {
  // Estado actual
  currentStep: SignUpStep;
  previousStep: SignUpStep | null;
  isTransitioning: boolean;
  stepHistory: SignUpStep[];
  
  // Navegación entre pasos
  goToStep: (step: SignUpStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetSteps: () => void;
  
  // Utilidades
  canGoBack: boolean;
  getStepIndex: (step?: SignUpStep) => number;
  getStepProgress: () => number;
  
  // Estados específicos
  isInitialStep: boolean;
  isCaptchaStep: boolean;
  isEmailVerificationStep: boolean;
  isCompleteRegisterStep: boolean;
  isCompletedStep: boolean;
}

// Orden de los pasos para progreso
const STEP_ORDER: SignUpStep[] = [
  'initial',
  'captcha', 
  'email-verification',
  'complete-register',
  'completed'
];

export const useFormSteps = (initialStep: SignUpStep = 'initial'): UseFormStepsReturn => {
  const [state, setState] = useState<FormStepsState>({
    currentStep: initialStep,
    previousStep: null,
    isTransitioning: false,
    stepHistory: [initialStep]
  });

  const goToStep = useCallback((step: SignUpStep) => {
    setState(prev => {
      // Evitar transiciones al mismo paso
      if (prev.currentStep === step) {
        return prev;
      }

      return {
        currentStep: step,
        previousStep: prev.currentStep,
        isTransitioning: true,
        stepHistory: [...prev.stepHistory, step]
      };
    });

    // Resetear estado de transición después de un breve delay
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isTransitioning: false
      }));
    }, 300);
  }, []);

  const goToNextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      goToStep(nextStep);
    }
  }, [state.currentStep, goToStep]);

  const goToPreviousStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex > 0) {
      const previousStep = STEP_ORDER[currentIndex - 1];
      goToStep(previousStep);
    }
  }, [state.currentStep, goToStep]);

  const resetSteps = useCallback(() => {
    setState({
      currentStep: 'initial',
      previousStep: null,
      isTransitioning: false,
      stepHistory: ['initial']
    });
  }, []);

  // Utilidades
  const canGoBack = STEP_ORDER.indexOf(state.currentStep) > 0;
  
  const getStepIndex = useCallback((step?: SignUpStep) => {
    const targetStep = step || state.currentStep;
    return STEP_ORDER.indexOf(targetStep);
  }, [state.currentStep]);

  const getStepProgress = useCallback(() => {
    const currentIndex = getStepIndex();
    return (currentIndex / (STEP_ORDER.length - 1)) * 100;
  }, [getStepIndex]);

  // Estados específicos para facilitar el uso condicional
  const isInitialStep = state.currentStep === 'initial';
  const isCaptchaStep = state.currentStep === 'captcha';
  const isEmailVerificationStep = state.currentStep === 'email-verification';
  const isCompleteRegisterStep = state.currentStep === 'complete-register';
  const isCompletedStep = state.currentStep === 'completed';

  return {
    // Estado
    currentStep: state.currentStep,
    previousStep: state.previousStep,
    isTransitioning: state.isTransitioning,
    stepHistory: state.stepHistory,
    
    // Navegación
    goToStep,
    goToNextStep,
    goToPreviousStep,
    resetSteps,
    
    // Utilidades
    canGoBack,
    getStepIndex,
    getStepProgress,
    
    // Estados específicos
    isInitialStep,
    isCaptchaStep,
    isEmailVerificationStep,
    isCompleteRegisterStep,
    isCompletedStep
  };
};

export default useFormSteps;