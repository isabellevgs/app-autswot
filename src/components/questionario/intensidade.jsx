function Intensidade({ 
  intensidade, 
  onIntensidadeChange,
  tipo = 'SH',
  perguntaIntensidade = null,
  intensidadeLeve = null,
  intensidadeModerada = null,
  intensidadeAlta = null
}) {
  const intensidades = tipo === 'CH' 
    ? [
        { valor: 1, descricao: intensidadeLeve },
        { valor: 2, descricao: intensidadeModerada },
        { valor: 3, descricao: intensidadeAlta }
      ]
    : [
        { valor: 1 },
        { valor: 2 },
        { valor: 3 }
      ];

  const getIntensidadeClasses = (valor, selecionado) => {
    const baseClasses = 'w-12 h-12 rounded-full border-2 transition-all duration-300 cursor-pointer';
    
    if (valor === 1) {
      return selecionado
        ? `${baseClasses} bg-violet-300 border-violet-300 shadow-lg ring-4 ring-violet-300/30`
        : `${baseClasses} bg-violet-300 border-violet-300`;
    }
    
    if (valor === 2) {
      return selecionado
        ? `${baseClasses} bg-violet-500 border-violet-500 shadow-lg ring-4 ring-violet-500/30`
        : `${baseClasses} bg-violet-500 border-violet-500`;
    }
    
    if (valor === 3) {
      return selecionado
        ? `${baseClasses} bg-purple-900 border-purple-900 shadow-lg ring-4 ring-purple-900/30`
        : `${baseClasses} bg-purple-900 border-purple-900`;
    }
    
    return baseClasses;
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      {/* Elementos ocultos para garantir que o Tailwind detecte todas as classes */}
      <div className="hidden">
        <div className="bg-purple-900 border-purple-900 ring-purple-900/30" />
        <div className="bg-violet-300 border-violet-300 ring-violet-300/30" />
        <div className="bg-violet-500 border-violet-500 ring-violet-500/30" />
      </div>

      <p className={`text-gray-800 font-medium text-base sm:text-lg mb-6 ${tipo === 'CH' ? 'text-left' : 'text-center'}`}>
        {perguntaIntensidade || 'Quando isso acontece, qual costuma ser a intensidade dessa reação ou comportamento?'}
      </p>
      
      {tipo === 'CH' ? (
        // Layout em coluna para CH com textos ao lado
        <div className="flex flex-col items-start gap-4">
          {intensidades.map((item) => {
            const selecionado = intensidade === item.valor;
            return (
              <button
                key={item.valor}
                type="button"
                onClick={() => onIntensidadeChange && onIntensidadeChange(item.valor)}
                className="flex items-center gap-4 transition-all duration-300 px-4 w-full"
              >
                <div className={getIntensidadeClasses(item.valor, selecionado)} />
                {item.descricao && (
                  <span className={`text-sm text-left flex-1 leading-tight ${selecionado ? 'font-semibold text-violet-700' : 'text-gray-600'}`}>
                    {item.descricao}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        // Layout horizontal para SH (sem textos)
        <div className="flex justify-center items-center gap-6">
          {intensidades.map((item) => {
            const selecionado = intensidade === item.valor;
            return (
              <button
                key={item.valor}
                type="button"
                onClick={() => onIntensidadeChange && onIntensidadeChange(item.valor)}
                className="flex items-center justify-center transition-all duration-300"
              >
                <div className={getIntensidadeClasses(item.valor, selecionado)} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Intensidade;

