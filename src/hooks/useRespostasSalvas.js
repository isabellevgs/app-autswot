import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Hook para carregar respostas já salvas do questionário
 */
export function useRespostasSalvas(tipo) {
  const [respostasSalvas, setRespostasSalvas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarRespostas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = tipo ? { tipo } : {};
        const response = await api.get('/questionario-resposta', { params });
        
        // Converter array de respostas em objeto indexado por perguntaId
        const respostasMap = {};
        response.data.respostas.forEach(resposta => {
          const key = `${resposta.tipo}-${resposta.perguntaId}`;
          respostasMap[key] = resposta;
        });
        
        setRespostasSalvas(respostasMap);
      } catch (err) {
        console.error('Erro ao carregar respostas salvas:', err);
        setError(err.response?.data?.error || 'Erro ao carregar respostas');
      } finally {
        setLoading(false);
      }
    };

    carregarRespostas();
  }, [tipo]);

  /**
   * Obter resposta salva para uma pergunta específica
   */
  const getRespostaSalva = (perguntaId, tipo) => {
    const key = `${tipo}-${perguntaId}`;
    return respostasSalvas[key] || null;
  };

  /**
   * Atualizar uma resposta salva no estado local (sem recarregar da API)
   */
  const atualizarRespostaSalva = (resposta) => {
    if (!resposta || !resposta.perguntaId || !resposta.tipo) return;
    
    const key = `${resposta.tipo}-${resposta.perguntaId}`;
    setRespostasSalvas(prev => ({
      ...prev,
      [key]: resposta
    }));
  };

  /**
   * Recarregar respostas da API
   */
  const recarregarRespostas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = tipo ? { tipo } : {};
      const response = await api.get('/questionario-resposta', { params });
      
      // Converter array de respostas em objeto indexado por perguntaId
      const respostasMap = {};
      response.data.respostas.forEach(resposta => {
        const key = `${resposta.tipo}-${resposta.perguntaId}`;
        respostasMap[key] = resposta;
      });
      
      setRespostasSalvas(respostasMap);
    } catch (err) {
      console.error('Erro ao recarregar respostas salvas:', err);
      setError(err.response?.data?.error || 'Erro ao recarregar respostas');
    } finally {
      setLoading(false);
    }
  };

  return {
    respostasSalvas,
    getRespostaSalva,
    atualizarRespostaSalva,
    recarregarRespostas,
    loading,
    error,
  };
}

