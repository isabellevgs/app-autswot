import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { transformarDadosSwot } from '../utils/swotUtils';
import { mapaStatusReflexoes } from '../utils/reflexaoTracoStatus';
import { SWOT_MODULOS } from '../constants/swotConfig';
import { extrairErroApi } from '../utils/api-errors';

const dadosVazios = () =>
  Object.keys(SWOT_MODULOS).reduce((acc, key) => {
    acc[key] = { ...SWOT_MODULOS[key], items: [] };
    return acc;
  }, {});

/**
 * Hook para gerenciar estado e buscar dados do SWOT + progresso de desbloqueio.
 */
export function useSwot() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressoError, setProgressoError] = useState(null);
  const [dadosSwot, setDadosSwot] = useState(dadosVazios);
  const [progresso, setProgresso] = useState(null);
  const [statusReflexoes, setStatusReflexoes] = useState({});

  const buscarProgresso = useCallback(async () => {
    try {
      const res = await api.get('/reflexao-traco/progresso');
      setProgresso(res.data);
      setProgressoError(null);
    } catch (err) {
      console.error('Erro ao carregar progresso SWOT:', err);
      setProgresso(null);
      setProgressoError(
        extrairErroApi(err, 'Não foi possível carregar o progresso de desbloqueio dos quadrantes.'),
      );
    }
  }, []);

  const buscarStatusReflexoes = useCallback(async () => {
    try {
      const res = await api.get('/reflexao-traco');
      setStatusReflexoes(mapaStatusReflexoes(res.data));
    } catch (err) {
      console.error('Erro ao carregar status das reflexões:', err);
      setStatusReflexoes({});
    }
  }, []);

  const refreshProgresso = useCallback(async () => {
    await Promise.all([buscarProgresso(), buscarStatusReflexoes()]);
  }, [buscarProgresso, buscarStatusReflexoes]);

  const carregarSwot = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [swotRes] = await Promise.all([
        api.get('/questionario-resposta/swot'),
        buscarProgresso(),
        buscarStatusReflexoes(),
      ]);

      const dadosTransformados = transformarDadosSwot(swotRes.data);
      const dadosCompletos = Object.keys(SWOT_MODULOS).reduce((acc, key) => {
        acc[key] = {
          ...SWOT_MODULOS[key],
          items: dadosTransformados[key]?.items || [],
        };
        return acc;
      }, {});

      setDadosSwot(dadosCompletos);
    } catch (err) {
      console.error('Erro ao buscar SWOT:', err);
      setError(extrairErroApi(err, 'Erro ao carregar resultados. Por favor, tente novamente.'));
    } finally {
      setLoading(false);
    }
  }, [buscarProgresso, buscarStatusReflexoes]);

  useEffect(() => {
    carregarSwot();
  }, [carregarSwot]);

  return {
    dadosSwot,
    progresso,
    progressoError,
    statusReflexoes,
    loading,
    error,
    refreshProgresso,
    recarregar: carregarSwot,
  };
}
