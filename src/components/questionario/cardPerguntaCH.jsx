import { useState } from 'react';
import Frequencia from './frequencia';
import Intensidade from './intensidade';
import RespostaSimNao from '../shared/RespostaSimNao';

function CardPerguntaCH({ 
  // Dados da história social
  perguntaId = '',
  introducao = null,
  titulo = null,
  personagem = null,
  ambientacao = null,
  historia = null,
  questionamento = null,
  // Resposta e callbacks
  resposta, 
  onRespostaChange, 
  mostrarFrequencia = false,
  frequencia,
  onFrequenciaChange,
  mostrarIntensidade = false,
  intensidade,
  onIntensidadeChange,
  // Campos de intensidade personalizados
  perguntaIntensidade = null,
  intensidadeLeve = null,
  intensidadeModerada = null,
  intensidadeAlta = null
}) {
  const [mostrarHistoria, setMostrarHistoria] = useState(true);

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl">
      {/* Título da História */}
      {titulo && (
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-violet-800 text-center mb-2">
            {titulo}
          </h2>
        </div>
      )}

      {/* Introdução */}
      {introducao && (
            <div className="mb-4">
              <p className="text-gray-700 text-lg leading-relaxed italic">
                {introducao}
              </p>
            </div>
          )} 

      {/* Área da História Social */}
      {historia && (
        <div className="mb-8 p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border-l-4 border-violet-500">
          {/* Personagem e Ambientação */}
          {(personagem || ambientacao) && (
            <div className="mb-4 pb-4 border-b border-violet-200">
              {personagem && (
                <p className="text-lg text-violet-700 font-semibold mb-1">
                  <span className="text-violet-600">Personagem:</span> {personagem}
                </p>
              )}
              {ambientacao && (
                <p className="text-lg text-violet-700 font-semibold">
                  <span className="text-violet-600">Ambientação:</span> {ambientacao}
                </p>
              )}
            </div>
          )}

          {/* História Social */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
              {historia}
            </p>
          </div>
        </div>
      )}

      {/* Questionamento */}
      {questionamento && (
        <div className="mb-8">
          <p className="text-gray-800 font-medium text-lg leading-relaxed mb-3">
            {questionamento}
          </p>
        </div>
      )}

      {/* Opções de resposta */}
      <RespostaSimNao resposta={resposta} onRespostaChange={onRespostaChange} />

      {/* Seção de Frequência - Aparece quando resposta é "sim" e mostrarFrequencia é true */}
      {resposta === 'sim' && mostrarFrequencia && (
        <Frequencia 
          frequencia={frequencia}
          onFrequenciaChange={onFrequenciaChange}
          tipo="CH"
          perguntaId={perguntaId}
        />
      )}

      {/* Seção de Intensidade - Aparece quando resposta é "sim", mostrarIntensidade é true e frequência foi selecionada */}
      {resposta === 'sim' && mostrarIntensidade && frequencia && (
        <Intensidade 
          intensidade={intensidade}
          onIntensidadeChange={onIntensidadeChange}
          tipo="CH"
          perguntaIntensidade={perguntaIntensidade}
          intensidadeLeve={intensidadeLeve}
          intensidadeModerada={intensidadeModerada}
          intensidadeAlta={intensidadeAlta}
        />
      )}
    </div>
  );
}

export default CardPerguntaCH;

