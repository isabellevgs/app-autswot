import { useState } from 'react';
import Frequencia from './frequencia';
import Intensidade from './intensidade';
import RespostaSimNao from '../shared/RespostaSimNao';
import ExplicacaoCard from '../shared/ExplicacaoCard';

function CartPerguntaSH({ 
  pergunta, 
  resposta, 
  onRespostaChange, 
  mostrarFrequencia = false,
  frequencia,
  onFrequenciaChange,
  mostrarIntensidade = false,
  intensidade,
  onIntensidadeChange,
  exemplo = null
}) {

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl">
      {/* Pergunta */}
      <div className="mb-8">
        <p className="text-gray-800 font-medium text-lg sm:text-xl leading-relaxed mb-3">
          {pergunta}
        </p>
        
        <ExplicacaoCard explicacao={exemplo} tipo="explicacao" />
      </div>

      {/* Opções de resposta */}
      <RespostaSimNao resposta={resposta} onRespostaChange={onRespostaChange} />

      {/* Seção de Frequência - Aparece quando resposta é "sim" e mostrarFrequencia é true */}
      {resposta === 'sim' && mostrarFrequencia && (
        <Frequencia 
          frequencia={frequencia}
          onFrequenciaChange={onFrequenciaChange}
          tipo="SH"
        />
      )}

      {/* Seção de Intensidade - Aparece quando resposta é "sim", mostrarIntensidade é true e frequência foi selecionada */}
      {resposta === 'sim' && mostrarIntensidade && frequencia && (
        <Intensidade 
          intensidade={intensidade}
          onIntensidadeChange={onIntensidadeChange}
          tipo="SH"
        />
      )}
    </div>
  );
}

export default CartPerguntaSH;

