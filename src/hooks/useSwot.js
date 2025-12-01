import { useState, useEffect } from 'react';
import api from '../services/api';
import { transformarDadosSwot } from '../utils/swotUtils';
import { SWOT_MODULOS } from '../constants/swotConfig';

/**
 * Hook para gerenciar estado e buscar dados do SWOT
 */
export function useSwot() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dadosSwot, setDadosSwot] = useState(() => {
    // Inicializar com estrutura vazia
    return Object.keys(SWOT_MODULOS).reduce((acc, key) => {
      acc[key] = {
        ...SWOT_MODULOS[key],
        items: []
      };
      return acc;
    }, {});
  });

  useEffect(() => {
    const buscarSwot = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/questionario-resposta/swot');
        const swotData = response.data;
        const dadosTransformados = transformarDadosSwot(swotData);

        // Combinar configuração com dados transformados
        const dadosCompletos = Object.keys(SWOT_MODULOS).reduce((acc, key) => {
          acc[key] = {
            ...SWOT_MODULOS[key],
            items: dadosTransformados[key]?.items || []
          };
          return acc;
        }, {});

        setDadosSwot(dadosCompletos);
      } catch (err) {
        console.error('Erro ao buscar SWOT:', err);
        setError('Erro ao carregar resultados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    buscarSwot();
  }, []);

  return {
    dadosSwot,
    loading,
    error
  };
}

