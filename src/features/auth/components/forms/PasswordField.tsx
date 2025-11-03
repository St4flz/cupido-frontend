// src/features/auth/components/forms/PasswordField.tsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  showRequirements?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  showRequirements = false,
  disabled = false,
  placeholder = "••••••••"
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E93923] pr-10 disabled:opacity-50"
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        disabled={disabled}
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default PasswordField;