import { useState, useEffect } from 'react';
import Frequencia from './frequencia';
import ExplicacaoCard from '../shared/ExplicacaoCard';

function CardOportunidadeFraquezas({ 
  pergunta, 
  explicacao = null,
  tracoNeutro = [],
  tracoOportunidade = [],
  tracoFraqueza = [],
  resposta, 
  onRespostaChange,
  frequencia,
  onFrequenciaChange
}) {
  const [tipoTraco, setTipoTraco] = useState(resposta || null); // 'neutro', 'oportunidade', 'fraqueza'

  // Sincronizar tipoTraco com a prop resposta quando ela mudar externamente
  useEffect(() => {
    setTipoTraco(resposta || null);
  }, [resposta]);

  // Função para lidar com a seleção do tipo de traço
  const handleTipoTracoChange = (tipo) => {
    setTipoTraco(tipo);
    onRespostaChange && onRespostaChange(tipo);
    // Resetar frequência quando mudar o tipo de traço
    onFrequenciaChange && onFrequenciaChange(null);
  };

  // Obter opções de frequência baseadas no tipo de traço selecionado
  const getOpcoesFrequencia = () => {
    if (tipoTraco === 'neutro') return tracoNeutro;
    if (tipoTraco === 'oportunidade') return tracoOportunidade;
    if (tipoTraco === 'fraqueza') return tracoFraqueza;
    return [];
  };

  const opcoesFrequencia = getOpcoesFrequencia();

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl">
      {/* Pergunta */}
      <div className="mb-8">
        <p className="text-gray-800 font-medium text-lg sm:text-xl leading-relaxed mb-3">
          {pergunta}
        </p>
        
        <ExplicacaoCard explicacao={explicacao} tipo="explicacao" />
      </div>

      <Frequencia
        frequencia={frequencia}
        onFrequenciaChange={onFrequenciaChange}
        tipo="FO"
      />
    </div>
  );
}

export default CardOportunidadeFraquezas;

