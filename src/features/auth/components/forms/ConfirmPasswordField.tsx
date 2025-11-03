// src/features/auth/components/forms/ConfirmPasswordField.tsx
import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface ConfirmPasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  originalPassword: string;
  disabled?: boolean;
  placeholder?: string;
}

const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = ({
  value,
  onChange,
  originalPassword,
  disabled = false,
  placeholder = "Confirma tu contraseña"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordsMatch = value === originalPassword && value.length > 0;

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E93923] pr-20 disabled:opacity-50 ${
          value.length > 0 
            ? passwordsMatch 
              ? 'border-green-300' 
              : 'border-red-300'
            : 'border-gray-300'
        }`}
        placeholder={placeholder}
        disabled={disabled}
      />
      
      {/* Icono de visibilidad */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        disabled={disabled}
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>

      {/* Icono de validación */}
      {value.length > 0 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {passwordsMatch ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <X className="w-4 h-4 text-red-500" />
          )}
        </div>
      )}
    </div>
  );
};

export default ConfirmPasswordField;