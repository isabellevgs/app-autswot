import { useState, useEffect, useCallback } from 'react';
import { fetchRespostasCached, invalidateRespostasCache } from '../utils/questionarioCache';
import { extrairErroApi } from '../utils/api-errors';
import { notifyQuestionarioUpdated } from '../utils/auth-events';

/**
 * Hook para carregar respostas já salvas do questionário
 */
export function useRespostasSalvas(tipo) {
  const [respostasSalvas, setRespostasSalvas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarRespostas = useCallback(async ({ force = false } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const respostasMap = await fetchRespostasCached({ tipo, force });
      setRespostasSalvas(respostasMap);
      return respostasMap;
    } catch (err) {
      console.error('Erro ao carregar respostas salvas:', err);
      setError(extrairErroApi(err, 'Erro ao carregar respostas'));
    } finally {
      setLoading(false);
    }
  }, [tipo]);

  useEffect(() => {
    carregarRespostas();
  }, [carregarRespostas]);

  const getRespostaSalva = (perguntaId, tipoPergunta) => {
    const key = `${tipoPergunta}-${perguntaId}`;
    return respostasSalvas[key] || null;
  };

  const atualizarRespostaSalva = (resposta) => {
    if (!resposta || !resposta.perguntaId || !resposta.tipo) return;

    const key = `${resposta.tipo}-${resposta.perguntaId}`;
    setRespostasSalvas((prev) => ({
      ...prev,
      [key]: resposta,
    }));
    invalidateRespostasCache();
    notifyQuestionarioUpdated();
  };

  const recarregarRespostas = useCallback(
    () => carregarRespostas({ force: true }),
    [carregarRespostas],
  );

  return {
    respostasSalvas,
    getRespostaSalva,
    atualizarRespostaSalva,
    recarregarRespostas,
    loading,
    error,
  };
}
