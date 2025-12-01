// Layout para páginas de Termos de Uso e Políticas
function TermsLayout({ title, children }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-5 rounded-2xl shadow-2xl">
      <div className="text-gray-900 font-bold text-3xl sm:text-4xl text-center pt-12 pb-6">
        {title}
      </div>
      
      <div className="flex flex-col mx-6 sm:mx-10 md:mx-16 lg:mx-20 gap-6 pb-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="prose prose-gray max-w-none space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsLayout;

