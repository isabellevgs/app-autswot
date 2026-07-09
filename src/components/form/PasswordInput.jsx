import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Campo de senha com botão mostrar/ocultar.
 * onChange recebe o valor string (compatível com ChangePasswordForm e telas de auth).
 */
function PasswordInput({
  label,
  id: idProp,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  helperText = '',
  hasError = false,
  className = '',
  autoComplete,
  maxLength,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const reactId = useId();
  const inputId = idProp || `password-${reactId}`;
  const showErr = !!error || hasError;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-gray-900 font-semibold mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
            showErr
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-violet-500'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? <EyeOff className="w-5 h-5" aria-hidden /> : <Eye className="w-5 h-5" aria-hidden />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}

export default PasswordInput;
