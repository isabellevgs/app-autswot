import TracoReflexaoStatus, { obterStatusTraco } from './TracoReflexaoStatus';

function SwotCard({ titulo, Icon, items, isExpandido, isBloqueado, onClick, gradient, descricao, onItemClick, statusPorTraco }) {
  const gradientClasses = {
    red: 'bg-gradient-to-r from-red-500 to-red-600',
    orange: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
  };

  const totalTracos = items?.length ?? 0;
  const semTracos = totalTracos === 0;
  const avisoSemTracos = 'Nenhum traço neste quadrante (0 traços).';

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

      {isExpandido && semTracos && !isBloqueado && (
        <span className="absolute top-4 right-4 bg-black/30 text-white text-xs font-semibold px-3 py-1 rounded-full">
          0 traços
        </span>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-white" />
        <h2 className="text-white font-bold text-xl sm:text-2xl">{titulo}</h2>
      </div>
      
      {isExpandido ? (
        semTracos ? (
          <p className="text-white/90 text-sm sm:text-base bg-black/20 rounded-lg px-3 py-2 mt-4">
            {avisoSemTracos}
          </p>
        ) : (
          <ul className="space-y-3 mt-4 text-white">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onItemClick?.(item);
                  }}
                  className="w-full flex items-center gap-2 text-left text-base sm:text-lg rounded-lg px-2 py-1.5 hover:bg-white/10 underline-offset-4 hover:underline transition-colors"
                >
                  <span className="flex-1 min-w-0">
                    {typeof item === 'object' ? item.label : item}
                  </span>
                  <TracoReflexaoStatus status={obterStatusTraco(item, statusPorTraco)} />
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className="text-white/80 text-sm sm:text-base">
          {descricao || 'Sem detalhes disponíveis.'}
        </p>
      )}
    </div>
  );
}

export default SwotCard;

