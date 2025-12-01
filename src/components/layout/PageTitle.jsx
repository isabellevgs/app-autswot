// Componente de título padrão para páginas

function PageTitle({ children, className = "" }) {
  return (
    <div className={`text-gray-900 font-bold text-3xl sm:text-4xl text-center pt-12 pb-6 ${className}`}>
      {children}
    </div>
  );
}

export default PageTitle;

