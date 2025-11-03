// src/features/auth/utils/validations.ts
export const validations = {
    email: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@unipamplona\.edu\.co$/;
      return emailRegex.test(email);
    },
  
    password: (password: string): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];
      
      if (password.length < 8) {
        errors.push('Mínimo 8 caracteres');
      }
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Al menos una letra minúscula');
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Al menos una letra mayúscula');
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.push('Al menos un número');
      }
      if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
        errors.push('Al menos un carácter especial');
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    },
  
    name: (name: string): boolean => {
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/;
      return nameRegex.test(name);
    },
  
    description: (description: string): boolean => {
      const descRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,!?]{0,250}$/;
      return descRegex.test(description);
    }
  };