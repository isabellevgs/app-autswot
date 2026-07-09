import { useState, useEffect, useCallback } from 'react';
import { fetchPerguntasCached } from '../utils/questionarioCache';
import { extrairErroApi } from '../utils/api-errors';

export function usePerguntas() {
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarPerguntas = useCallback(async ({ force = false } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const perguntasOrdenadas = await fetchPerguntasCached({ force });
      setPerguntas(perguntasOrdenadas);
      return perguntasOrdenadas;
    } catch (err) {
      console.error('Erro ao buscar perguntas:', err);
      setError(extrairErroApi(err, 'Erro ao carregar perguntas. Tente novamente mais tarde.'));
      setPerguntas([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPerguntas();
  }, [carregarPerguntas]);

  const recarregar = useCallback(() => carregarPerguntas({ force: true }), [carregarPerguntas]);

  return { perguntas, loading, error, recarregar };
}
