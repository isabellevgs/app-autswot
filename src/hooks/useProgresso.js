import { useState, useEffect, useCallback } from 'react';
import { fetchPerguntasCached, fetchRespostasCached } from '../utils/questionarioCache';
import { contarRespostasCompletas, questionarioEstaCompleto, contarPerguntasRespondiveis } from '../utils/questionarioValidation';
import { extrairErroApi } from '../utils/api-errors';
import { QUESTIONARIO_SYNC_KEY } from '../utils/auth-events';

/**
 * Retorna o estado de progresso do questionário do usuário logado.
 *
 * status:
 *   null            → ainda não carregou ou falhou ao carregar
 *   'nao_iniciado'  → 0 respostas completas
 *   'em_andamento'  → 1..total-1 respostas completas
 *   'concluido'     → todas as perguntas com resposta válida
 */
export function useProgresso() {
  const [status, setStatus] = useState(null);
  const [porcentagem, setPorcentagem] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregar = useCallback(async ({ force = false } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const [perguntas, respostasMap] = await Promise.all([
        fetchPerguntasCached({ force }),
        fetchRespostasCached({ force }),
      ]);

      const total = contarPerguntasRespondiveis(perguntas);
      const respondidas = contarRespostasCompletas(perguntas, respostasMap);
      const pct = total > 0 ? Math.min(100, Math.round((respondidas / total) * 100)) : 0;

      setPorcentagem(pct);

      if (respondidas === 0) {
        setStatus('nao_iniciado');
      } else if (questionarioEstaCompleto(perguntas, respostasMap)) {
        setStatus('concluido');
      } else {
        setStatus('em_andamento');
      }
    } catch (err) {
      console.error('Erro ao carregar progresso:', err);
      setError(extrairErroApi(err, 'Não foi possível carregar o progresso do questionário.'));
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === QUESTIONARIO_SYNC_KEY) {
        carregar({ force: true });
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [carregar]);

  const recarregar = useCallback(() => carregar({ force: true }), [carregar]);

  return { status, porcentagem, loading, error, recarregar };
}
