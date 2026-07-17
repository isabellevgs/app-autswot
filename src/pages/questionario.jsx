import { useNavigate, Navigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
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
import {
  estaDesabilitado,
  questionarioEstaCompleto,
  perguntaChHistoriaIndisponivel,
  contarPerguntasRespondiveis,
  contarRespostasCompletas,
  indiceRespondivelAtual,
} from '../utils/questionarioValidation';
import { extrairErroApi } from '../utils/api-errors';

function Questionario() {
  const navigate = useNavigate();
  const { perguntas, loading, error, recarregar } = usePerguntas();
  const {
    respostasSalvas,
    atualizarRespostaSalva,
    loading: loadingRespostas,
    error: errorRespostas,
    recarregarRespostas,
  } = useRespostasSalvas();
  const { salvarResposta, prepararDadosResposta, salvando } = useSalvarResposta();
  const [recarregandoHistoria, setRecarregandoHistoria] = useState(false);
  const [recarregando, setRecarregando] = useState(false);

  const {
    perguntaAtualIndex,
    resposta,
    setResposta,
    handleRespostaChange,
    handleFrequenciaChange,
    frequencia,
    setFrequencia,
    intensidade,
    setIntensidade,
    perguntaAtualData,
    totalPerguntas,
    perguntaTemIntensidade,
    avancarPergunta: avancarPerguntaOriginal,
    voltarPergunta,
    reposicionar,
  } = useQuestionario(perguntas, respostasSalvas, loadingRespostas);

  const carregando = loading || loadingRespostas;
  const historiaIndisponivel = perguntaChHistoriaIndisponivel(perguntaAtualData);
  const totalRespondiveis = contarPerguntasRespondiveis(perguntas);
  const respostasCompletas = contarRespostasCompletas(perguntas, respostasSalvas);

  const salvarRespostaAtual = useCallback(async () => {
    if (!perguntaAtualData) return;

    if (perguntaChHistoriaIndisponivel(perguntaAtualData)) {
      throw new Error(
        'Não foi possível salvar: a história social desta pergunta não carregou. Tente recarregar.',
      );
    }

    const dadosResposta = prepararDadosResposta(
      perguntaAtualData,
      resposta,
      frequencia,
      intensidade,
    );
    const response = await salvarResposta(dadosResposta);

    if (response?.resposta) {
      atualizarRespostaSalva(response.resposta);
    }
  }, [
    perguntaAtualData,
    resposta,
    frequencia,
    intensidade,
    prepararDadosResposta,
    salvarResposta,
    atualizarRespostaSalva,
  ]);

  const avancarPergunta = useCallback(async () => {
    try {
      if (!perguntaChHistoriaIndisponivel(perguntaAtualData)) {
        await salvarRespostaAtual();
      }

      if (perguntaAtualIndex >= totalPerguntas - 1) {
        const dadosAtuais = prepararDadosResposta(
          perguntaAtualData,
          resposta,
          frequencia,
          intensidade,
        );
        const key = `${dadosAtuais.tipo}-${dadosAtuais.perguntaId}`;
        const respostasAtualizadas = {
          ...respostasSalvas,
          [key]: { ...respostasSalvas[key], ...dadosAtuais },
        };

        if (!questionarioEstaCompleto(perguntas, respostasAtualizadas)) {
          alert('Ainda há perguntas incompletas. Revise suas respostas antes de finalizar.');
          return;
        }

        navigate('/resultados');
      } else {
        avancarPerguntaOriginal();
      }
    } catch (err) {
      console.error('Erro ao salvar antes de avançar:', err);
      alert(extrairErroApi(err));
    }
  }, [
    salvarRespostaAtual,
    avancarPerguntaOriginal,
    perguntaAtualIndex,
    totalPerguntas,
    perguntaAtualData,
    resposta,
    frequencia,
    intensidade,
    prepararDadosResposta,
    respostasSalvas,
    perguntas,
    navigate,
  ]);

  const salvarEFechar = useCallback(async () => {
    try {
      if (!perguntaChHistoriaIndisponivel(perguntaAtualData)) {
        await salvarRespostaAtual();
      }
      navigate('/');
    } catch (err) {
      console.error('Erro ao salvar antes de fechar:', err);
      alert(extrairErroApi(err));
    }
  }, [salvarRespostaAtual, navigate, perguntaAtualData]);

  const handleRecarregarHistoria = useCallback(async () => {
    setRecarregandoHistoria(true);
    try {
      await recarregar();
    } catch (err) {
      alert(extrairErroApi(err));
    } finally {
      setRecarregandoHistoria(false);
    }
  }, [recarregar]);

  const handleRecarregarPerguntas = useCallback(async () => {
    setRecarregando(true);
    try {
      await recarregar();
      reposicionar();
    } catch (err) {
      alert(extrairErroApi(err));
    } finally {
      setRecarregando(false);
    }
  }, [recarregar, reposicionar]);

  const handleRecarregarRespostas = useCallback(async () => {
    setRecarregando(true);
    try {
      await recarregarRespostas();
    } catch (err) {
      alert(extrairErroApi(err));
    } finally {
      setRecarregando(false);
    }
  }, [recarregarRespostas]);

  const desabilitadoAvancar =
    estaDesabilitado(
      perguntaAtualData,
      resposta,
      frequencia,
      intensidade,
    ) || salvando;

  const posicaoRespondivel = indiceRespondivelAtual(perguntas, perguntaAtualIndex);

  if (carregando) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-5 rounded-2xl shadow-2xl pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
          <p className="text-gray-700 text-lg">Carregando questionário...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-5 rounded-2xl shadow-2xl pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 px-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600" />
          <p className="text-red-600 text-lg">{error}</p>
          <p className="text-sm text-gray-600">
            Não foi possível carregar as perguntas. Verifique sua conexão e tente novamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRecarregarPerguntas}
              disabled={recarregando}
              className="px-6 py-3 rounded-xl bg-violet-700 text-white font-semibold hover:bg-violet-800 disabled:opacity-60 transition-colors"
            >
              {recarregando ? 'Recarregando…' : 'Tentar novamente'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (errorRespostas) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-5 rounded-2xl shadow-2xl pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 px-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600" />
          <p className="text-red-600 text-lg">{errorRespostas}</p>
          <p className="text-sm text-gray-600">
            Não foi possível carregar suas respostas salvas. Tente novamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRecarregarRespostas}
              disabled={recarregando}
              className="px-6 py-3 rounded-xl bg-violet-700 text-white font-semibold hover:bg-violet-800 disabled:opacity-60 transition-colors"
            >
              {recarregando ? 'Recarregando…' : 'Tentar novamente'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  if (questionarioEstaCompleto(perguntas, respostasSalvas)) {
    return <Navigate to="/resultados" replace />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mt-5 rounded-2xl shadow-2xl pb-12">
      <div className="pt-8 pb-6 px-6">
        <div className="text-gray-900 font-bold text-3xl sm:text-4xl text-center mb-4">QUESTIONÁRIO</div>

        <ProgressBar
          perguntaAtual={posicaoRespondivel}
          totalRespondiveis={totalRespondiveis}
          completadas={respostasCompletas}
        />
      </div>

      <div className="flex flex-col px-6 sm:px-10 md:px-16 lg:px-20 xl:px-32 gap-8 max-w-4xl xl:max-w-5xl mx-auto">
        {historiaIndisponivel && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">História social indisponível</p>
                <p className="text-sm text-red-700 mt-1">
                  Não foi possível carregar o conteúdo desta pergunta. Você pode pular para a
                  próxima ou tentar recarregar.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRecarregarHistoria}
              disabled={recarregandoHistoria}
              className="shrink-0 px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              {recarregandoHistoria ? 'Recarregando…' : 'Tentar novamente'}
            </button>
          </div>
        )}

        {perguntaAtualData && !historiaIndisponivel && (
          <>
            {perguntaAtualData.tipo === 'SH' && (
              <CartPerguntaSH
                key={perguntaAtualData.id || perguntaAtualIndex}
                pergunta={perguntaAtualData.pergunta}
                perguntaId={perguntaAtualData.id}
                resposta={resposta}
                onRespostaChange={handleRespostaChange}
                mostrarFrequencia={true}
                frequencia={frequencia}
                onFrequenciaChange={handleFrequenciaChange}
                mostrarIntensidade={perguntaTemIntensidade}
                intensidade={intensidade}
                onIntensidadeChange={setIntensidade}
                exemplo={perguntaAtualData.explicacao || null}
              />
            )}

            {perguntaAtualData.tipo === 'CH' && (
              <CardPerguntaCH
                key={perguntaAtualData.id || perguntaAtualIndex}
                perguntaId={perguntaAtualData.id}
                introducao={perguntaAtualData.introducao}
                titulo={perguntaAtualData.titulo}
                personagem={perguntaAtualData.personagem}
                ambientacao={perguntaAtualData.ambientacao}
                historia={perguntaAtualData.historiaTexto}
                questionamento={perguntaAtualData.questionamento}
                resposta={resposta}
                onRespostaChange={handleRespostaChange}
                mostrarFrequencia={true}
                frequencia={frequencia}
                onFrequenciaChange={handleFrequenciaChange}
                mostrarIntensidade={perguntaTemIntensidade}
                intensidade={intensidade}
                onIntensidadeChange={setIntensidade}
                perguntaIntensidade={perguntaAtualData.perguntaIntensidade}
                intensidadeLeve={perguntaAtualData.intensidadeLeve}
                intensidadeModerada={perguntaAtualData.intensidadeModerada}
                intensidadeAlta={perguntaAtualData.intensidadeAlta}
              />
            )}

            {perguntaAtualData.tipo === 'FO' && (
              <CardOportunidadeFraquezas
                key={perguntaAtualData.id || perguntaAtualIndex}
                pergunta={perguntaAtualData.pergunta}
                perguntaId={perguntaAtualData.id}
                explicacao={perguntaAtualData.explicacao || null}
                resposta={resposta}
                onRespostaChange={setResposta}
                frequencia={frequencia}
                onFrequenciaChange={setFrequencia}
              />
            )}

            {perguntaAtualData.tipo === 'F' && (
              <CardForcas
                key={perguntaAtualData.id || perguntaAtualIndex}
                pergunta={perguntaAtualData.pergunta}
                perguntaId={perguntaAtualData.id}
                exemplo={perguntaAtualData.exemplo || null}
                resposta={resposta}
                onRespostaChange={setResposta}
                frequencia={frequencia}
                onFrequenciaChange={setFrequencia}
              />
            )}
          </>
        )}

        <BotoesNavegacao
          perguntaAtualIndex={perguntaAtualIndex}
          totalPerguntas={perguntas.length}
          desabilitadoAvancar={desabilitadoAvancar}
          desabilitadoSalvarFechar={salvando}
          onVoltar={() => navigate('/')}
          onAnterior={voltarPergunta}
          onSalvarFechar={salvarEFechar}
          onAvançar={avancarPergunta}
        />

        {salvando && (
          <div className="text-center text-sm text-gray-600">Salvando...</div>
        )}
      </div>
    </div>
  );
}

export default Questionario;
