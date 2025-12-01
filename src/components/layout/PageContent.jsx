// Componente para área de conteúdo das páginas com padding padrão

function PageContent({ children, className = "" }) {
  return (
    <div className={`flex flex-col mx-6 sm:mx-10 md:mx-16 lg:mx-20 gap-6 pb-10 ${className}`}>
      {children}
    </div>
  );
}

export default PageContent;

