import Frequencia from './frequencia';
import RespostaSimNao from '../shared/RespostaSimNao';

function CardForcas({ 
  pergunta, 
  exemplo = null,
  resposta,
  onRespostaChange,
  frequencia,
  onFrequenciaChange
}) {
  const handleRespostaChange = (value) => {
    onRespostaChange && onRespostaChange(value);
    onFrequenciaChange && onFrequenciaChange(null);
  };

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl">
      {/* Pergunta */}
      <div className="mb-8">
        <p className="text-gray-800 font-medium text-lg sm:text-xl leading-relaxed mb-3">
          {pergunta}
        </p>
        
        {/* Exemplo */}
        <p className="text-gray-800 text-base leading-relaxed">{exemplo}</p>
      </div>

      <RespostaSimNao resposta={resposta} onRespostaChange={handleRespostaChange} />

      {resposta === 'sim' && (
        <Frequencia
          frequencia={frequencia}
          onFrequenciaChange={onFrequenciaChange}
          tipo="F"
        />
      )}
    </div>
  );
}

export default CardForcas;

