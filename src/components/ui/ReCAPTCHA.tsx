import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCAPTCHAProps {
  onChange: (token: string | null) => void;
  onExpired?: () => void;
  className?: string;
}

const ReCAPTCHAComponent: React.FC<ReCAPTCHAProps> = ({
  onChange,
  onExpired,
  className = ""
}) => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.warn('reCAPTCHA site key not configured in environment variables');
    return (
      <div className={`p-4 border-2 border-dashed border-gray-300 rounded-lg text-center ${className}`}>
        <p className="text-gray-500 text-sm">
          ⚠️ reCAPTCHA no configurado
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Agrega VITE_RECAPTCHA_SITE_KEY al archivo .env
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={onChange}
        onExpired={onExpired}
        theme="light"
        size="normal"
      />
    </div>
  );
};

export default ReCAPTCHAComponent;