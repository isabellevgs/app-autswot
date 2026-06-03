import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import CartPerguntaSH from '../components/questionario/cartPerguntaSH';
import CardPerguntaCH from '../components/questionario/cardPerguntaCH';
import CardOportunidadeFraquezas from '../components/questionario/cardOportunidadeFraquezas';
import CardForcas from '../components/questionario/cardForcas';
import ProgressBar from '../components/questionario/progressBar';
import BotoesNavegacao from '../components/shared/BotoesNavegacao';
import { usePerguntas } from '../hooks/usePerguntas';
import { useQuestionario } from '../hooks/useQuestionario';
import { useSalvarResposta } from '../hooks/useSalvarResposta';
import { useRespostasSalvas } from '../hooks/useRespostasSalvas';
import { estaDesabilitado } from '../utils/questionarioValidation';
import { questionarioEstaCompleto } from '../utils/questionarioCompleto';

function Questionario() {
  const navigate = useNavigate();
  const { perguntas, loading, error } = usePerguntas();
  const { respostasSalvas, atualizarRespostaSalva, loading: loadingRespostas } = useRespostasSalvas();
  const { salvarResposta, prepararDadosResposta, salvando } = useSalvarResposta();
  
  const {
    perguntaAtualIndex,
    resposta,
    setResposta,
    frequencia,
    setFrequencia,
    intensidade,
    setIntensidade,
    perguntaAtualData,
    perguntaAtual,
    totalPerguntas,
    perguntaTemIntensidade,
    avancarPergunta: avancarPerguntaOriginal,
    voltarPergunta
  } = useQuestionario(perguntas, respostasSalvas, loadingRespostas);

  // Função para salvar resposta atual
  const salvarRespostaAtual = useCallback(async () => {
    if (!perguntaAtualData) return;

    try {
      const dadosResposta = prepararDadosResposta(
        perguntaAtualData,
        resposta,
        frequencia,
        intensidade
      );
      const response = await salvarResposta(dadosResposta);
      
      // Atualizar estado local imediatamente após salvar
      if (response?.resposta) {
        atualizarRespostaSalva(response.resposta);
      }
    } catch (err) {
      console.error('Erro ao salvar resposta:', err);
      throw err; // Re-throw para que o erro seja tratado pelo chamador
    }
  }, [perguntaAtualData, resposta, frequencia, intensidade, prepararDadosResposta, salvarResposta, atualizarRespostaSalva]);

  // Função para avançar e salvar antes
  const avancarPergunta = useCallback(async () => {
    try {
      await salvarRespostaAtual();
      
      // Se for a última pergunta, navega para o SWOT
      if (perguntaAtualIndex >= totalPerguntas - 1) {
        navigate('/resultados');
      } else {
        avancarPerguntaOriginal();
      }
    } catch (err) {
      console.error('Erro ao salvar antes de avançar:', err);
      alert('Erro ao salvar resposta. Por favor, tente novamente.');
    }
  }, [salvarRespostaAtual, avancarPerguntaOriginal, perguntaAtualIndex, totalPerguntas, navigate]);

  // Função para salvar e fechar
  const salvarEFechar = useCallback(async () => {
    try {
      await salvarRespostaAtual();
      navigate('/');
    } catch (err) {
      console.error('Erro ao salvar antes de fechar:', err);
      // Ainda assim navega, mas mostra erro
      alert('Erro ao salvar. Suas respostas podem não ter sido salvas.');
    }
  }, [salvarRespostaAtual, navigate]);

  const desabilitado = estaDesabilitado(
    perguntaAtualIndex,
    totalPerguntas,
    perguntaAtualData,
    resposta,
    frequencia,
    intensidade,
    perguntaTemIntensidade
  );

  // Verificar se o questionário já foi finalizado e redirecionar para o SWOT
  useEffect(() => {
    // Só verifica após carregar perguntas e respostas
    if (!loading && !loadingRespostas && perguntas.length > 0) {
      const completo = questionarioEstaCompleto(perguntas, respostasSalvas);
      if (completo) {
        navigate('/resultados');
      }
    }
  }, [loading, loadingRespostas, perguntas, respostasSalvas, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-5 rounded-2xl shadow-2xl pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
          <p className="text-gray-700 text-lg">Carregando perguntas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-5 rounded-2xl shadow-2xl pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 px-6">
          <p className="text-red-600 text-lg text-center">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Se não houver perguntas
  if (perguntas.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-5 rounded-2xl shadow-2xl pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 px-6">
          <p className="text-gray-700 text-lg text-center">Nenhuma pergunta encontrada.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-5 rounded-2xl shadow-2xl pb-12">
      <div className="pt-8 pb-6 px-6">
        <div className="text-gray-900 font-bold text-3xl sm:text-4xl text-center mb-4">QUESTIONÁRIO</div>
        
        <ProgressBar 
          perguntaAtual={perguntaAtual} 
          totalPerguntas={totalPerguntas} 
        />
      </div>
      
      <div className="flex flex-col px-6 sm:px-10 md:px-16 lg:px-20 xl:px-32 gap-8 max-w-4xl xl:max-w-5xl mx-auto">
        {perguntaAtualData && (
          <>
            {/* Renderizar CartPerguntaSH para perguntas do tipo SH */}
            {perguntaAtualData.tipo === 'SH' && (
              <CartPerguntaSH
                key={perguntaAtualData.id || perguntaAtualIndex}
                pergunta={perguntaAtualData.pergunta}
                resposta={resposta}
                onRespostaChange={setResposta}
                mostrarFrequencia={true}
                frequencia={frequencia}
                onFrequenciaChange={setFrequencia}
                mostrarIntensidade={true}
                intensidade={intensidade}
                onIntensidadeChange={setIntensidade}
                exemplo={perguntaAtualData.explicacao || null}
              />
            )}
            
            {/* Renderizar CardPerguntaCH para perguntas do tipo CH */}
            {perguntaAtualData.tipo === 'CH' && (
              <CardPerguntaCH
                key={perguntaAtualData.id || perguntaAtualIndex}
                introducao={perguntaAtualData.introducao}
                titulo={perguntaAtualData.titulo}
                personagem={perguntaAtualData.personagem}
                ambientacao={perguntaAtualData.ambientacao}
                historia={perguntaAtualData.historiaTexto}
                questionamento={perguntaAtualData.questionamento}
                resposta={resposta}
                onRespostaChange={setResposta}
                mostrarFrequencia={true}
                frequencia={frequencia}
                onFrequenciaChange={setFrequencia}
                mostrarIntensidade={true}
                intensidade={intensidade}
                onIntensidadeChange={setIntensidade}
                perguntaIntensidade={perguntaAtualData.perguntaIntensidade}
                intensidadeLeve={perguntaAtualData.intensidadeLeve}
                intensidadeModerada={perguntaAtualData.intensidadeModerada}
                intensidadeAlta={perguntaAtualData.intensidadeAlta}
              />
            )}

            {/* Renderizar CardOportunidadeFraquezas para perguntas do tipo FO */}
            {perguntaAtualData.tipo === 'FO' && (
              <CardOportunidadeFraquezas
                key={perguntaAtualData.id || perguntaAtualIndex}
                pergunta={perguntaAtualData.pergunta}
                explicacao={perguntaAtualData.explicacao || null}
                resposta={resposta}
                onRespostaChange={setResposta}
                frequencia={frequencia}
                onFrequenciaChange={setFrequencia}
              />
            )}

            {/* Renderizar CardForcas para perguntas do tipo F */}
            {perguntaAtualData.tipo === 'F' && (
              <CardForcas
                key={perguntaAtualData.id || perguntaAtualIndex}
                pergunta={perguntaAtualData.pergunta}
                exemplo={perguntaAtualData.exemplo || null}
                resposta={resposta}
                onRespostaChange={setResposta}
                frequencia={frequencia}
                onFrequenciaChange={setFrequencia}
              />
            )}
          </>
        )}

        {/* Botões de navegação */}
        <BotoesNavegacao
          perguntaAtualIndex={perguntaAtualIndex}
          totalPerguntas={perguntas.length}
          desabilitado={desabilitado || salvando}
          onVoltar={() => navigate('/')}
          onAnterior={voltarPergunta}
          onSalvarFechar={salvarEFechar}
          onAvançar={avancarPergunta}
        />
        
        {salvando && (
          <div className="text-center text-sm text-gray-600">
            Salvando...
          </div>
        )}
      </div>
    </div>
  )
}

export default Questionario
