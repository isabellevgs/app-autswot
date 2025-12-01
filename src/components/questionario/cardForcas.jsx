import Frequencia from './frequencia';

function CardForcas({ 
  pergunta, 
  exemplo = null,
  frequencia,
  onFrequenciaChange
}) {

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

      <Frequencia
          frequencia={frequencia}
          onFrequenciaChange={onFrequenciaChange}
          tipo="F"
        />
    </div>
  );
}

export default CardForcas;

