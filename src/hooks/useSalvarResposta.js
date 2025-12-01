import { useState } from 'react';
import api from '../services/api';

/**
 * Hook para salvar respostas do questionário
 */
export function useSalvarResposta() {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  /**
   * Salvar uma resposta individual
   */
  const salvarResposta = async (dadosResposta) => {
    try {
      setSalvando(true);
      setErro(null);
      
      const response = await api.post('/questionario-resposta', dadosResposta);
      return response.data;
    } catch (err) {
      const mensagemErro = err.response?.data?.error || 'Erro ao salvar resposta';
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
      return response.data;
    } catch (err) {
      const mensagemErro = err.response?.data?.error || 'Erro ao salvar respostas';
      setErro(mensagemErro);
      throw err;
    } finally {
      setSalvando(false);
    }
  };

  /**
   * Preparar dados da resposta para salvar
   */
  const prepararDadosResposta = (perguntaData, resposta, frequencia, intensidade) => {
    return {
      perguntaId: perguntaData.id,
      tipo: perguntaData.tipo,
      numeroTraco: perguntaData.numeroTraco,
      resposta: resposta || null,
      frequencia: frequencia || null,
      intensidade: intensidade || null,
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

