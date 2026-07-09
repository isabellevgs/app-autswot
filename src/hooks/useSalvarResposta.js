import { useState } from 'react';
import api from '../services/api';
import { invalidateRespostasCache } from '../utils/questionarioCache';
import { perguntaTemIntensidade } from '../utils/questionarioValidation';
import { extrairErroApi } from '../utils/api-errors';
import { notifyQuestionarioUpdated } from '../utils/auth-events';

/**
 * Hook para salvar respostas do questionário
 */
export function useSalvarResposta() {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const salvarResposta = async (dadosResposta) => {
    try {
      setSalvando(true);
      setErro(null);

      const response = await api.post('/questionario-resposta', dadosResposta);
      invalidateRespostasCache();
      notifyQuestionarioUpdated();
      return response.data;
    } catch (err) {
      const mensagemErro = extrairErroApi(err, 'Erro ao salvar resposta');
      setErro(mensagemErro);
      throw err;
    } finally {
      setSalvando(false);
    }
  };

  /**
   * Salvar múltiplas respostas em batch
   */
  const salvarRespostas = async (respostas) => {
    try {
      setSalvando(true);
      setErro(null);

      const response = await api.post('/questionario-resposta/batch', { respostas });
      invalidateRespostasCache();
      notifyQuestionarioUpdated();
      return response.data;
    } catch (err) {
      const mensagemErro = extrairErroApi(err, 'Erro ao salvar resposta');
      setErro(mensagemErro);
      throw err;
    } finally {
      setSalvando(false);
    }
  };

  /**
   * Preparar dados da resposta para salvar (remove campos irrelevantes)
   */
  const prepararDadosResposta = (perguntaData, resposta, frequencia, intensidade) => {
    const exigeIntensidade = perguntaTemIntensidade(perguntaData);

    return {
      perguntaId: perguntaData.id,
      tipo: perguntaData.tipo,
      numeroTraco: perguntaData.numeroTraco,
      resposta: resposta || null,
      frequencia: resposta === 'sim' ? (frequencia || null) : null,
      intensidade: resposta === 'sim' && exigeIntensidade ? (intensidade || null) : null,
    };
  };

  return {
    salvarResposta,
    salvarRespostas,
    prepararDadosResposta,
    salvando,
    erro,
  };
}

