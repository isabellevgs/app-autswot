// Componente para cards de seção com ícone, título e descrição
function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
          {Icon && <Icon className="w-6 h-6 text-violet-600" />}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default SectionCard;

