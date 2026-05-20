import { useState, useEffect } from 'react';
import api from '../services/api';

async function fetchTotalPerguntas() {
  const [sh, ch, fo, f] = await Promise.all([
    api.get('/fraquezas-ameacas-sh',    { params: { page: 1, limit: 500 } }),
    api.get('/fraquezas-ameacas-ch',    { params: { page: 1, limit: 500 } }),
    api.get('/fraquezas-oportunidades', { params: { page: 1, limit: 500 } }),
    api.get('/forcas',                  { params: { page: 1, limit: 500 } }),
  ]);
  return (
    (sh.data?.registros?.length  ?? 0) +
    (ch.data?.registros?.length  ?? 0) +
    (fo.data?.registros?.length  ?? 0) +
    (f.data?.registros?.length   ?? 0)
  );
}

/**
 * Retorna o estado de progresso do questionário do usuário logado.
 *
 * status:
 *   'nao_iniciado'  → 0 respostas
 *   'em_andamento'  → 1..total-1 respostas
 *   'concluido'     → >= total respostas
 */
export function useProgresso() {
  const [status, setStatus] = useState('nao_iniciado');
  const [porcentagem, setPorcentagem] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [total, respostasResp] = await Promise.all([
          fetchTotalPerguntas(),
          api.get('/questionario-resposta'),
        ]);

        if (cancelled) return;

        const respondidas = respostasResp.data?.respostas?.length ?? 0;
        const pct = total > 0 ? Math.min(100, Math.round((respondidas / total) * 100)) : 0;

        setPorcentagem(pct);

        if (respondidas === 0) {
          setStatus('nao_iniciado');
        } else if (pct >= 100) {
          setStatus('concluido');
        } else {
          setStatus('em_andamento');
        }
      } catch {
        // Em caso de erro mantém 'nao_iniciado'
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { status, porcentagem, loading };
}
