import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function PasswordInput({ 
  label, 
  value, 
  onChange, 
  placeholder = "",
  required = false,
  error = "",
  hasError = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${
        hasError ? 'text-red-700' : 'text-gray-700'
      }`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none pr-10 ${
            hasError 
              ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}

export default PasswordInput;

