// Componente para cabeçalho de seção com título e descrição
function SectionHeader({ title, subtitle }) {
  return (
    <div className="pt-12 pb-8 px-6">
      <h1 className="text-gray-900 font-bold text-4xl sm:text-5xl text-center mb-3">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600 text-lg sm:text-xl text-center">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;

