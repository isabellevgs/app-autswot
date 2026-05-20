function SwotCard({ titulo, Icon, items, isExpandido, isBloqueado, onClick, gradient, descricao, onItemClick }) {
  const gradientClasses = {
    red: 'bg-gradient-to-r from-red-500 to-red-600',
    orange: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
  };

  return (
    <div 
      onClick={!isBloqueado ? onClick : undefined}
      className={`rounded-2xl p-6 min-h-[170px] transition-all duration-300 shadow-lg ${
        gradientClasses[gradient] || 'bg-gradient-to-r from-gray-500 to-gray-600'
      } ${isBloqueado ? 'relative cursor-not-allowed' : 'cursor-default'}`}
    >
      {isBloqueado && (
        <span className="absolute top-4 right-4 bg-black/30 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Bloqueado
        </span>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-white" />
        <h2 className="text-white font-bold text-xl sm:text-2xl">{titulo}</h2>
      </div>
      
      {isExpandido && items.length > 0 ? (
        <ul className="space-y-3 mt-4 text-white">
          {items.map((item, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onItemClick?.(item);
                }}
                className="w-full text-left text-base sm:text-lg rounded-lg px-2 py-1.5 hover:bg-white/10 underline-offset-4 hover:underline transition-colors"
              >
                {typeof item === 'object' ? item.label : item}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/80 text-sm sm:text-base">
          {descricao || 'Sem detalhes disponíveis.'}
        </p>
      )}
    </div>
  );
}

export default SwotCard;

