// Componente de container padrão para páginas internas

function PageContainer({ children, className = "" }) {
  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-5 rounded-2xl shadow-2xl ${className}`}>
      {children}
    </div>
  );
}

export default PageContainer;

