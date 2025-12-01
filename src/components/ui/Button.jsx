// Componente de botão reutilizável com variantes

function Button({ 
  children, 
  onClick, 
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled = false,
  ...props
}) {
  const baseStyles = "font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-violet-700 hover:bg-violet-800 active:bg-violet-900 text-white focus:ring-4 focus:ring-violet-300",
    secondary: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white",
    success: "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white",
    danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white",
    outline: "border-2 border-violet-700 text-violet-700 hover:bg-violet-50 active:bg-violet-100",
  };
  
  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-2.5",
    lg: "text-lg px-8 py-3",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

