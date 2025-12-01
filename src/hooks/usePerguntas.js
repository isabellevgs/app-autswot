import { useState, useEffect } from 'react';
import api from '../services/api';

export function usePerguntas() {
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarPerguntas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar todas as perguntas em paralelo
        const [responseSH, responseCH, responseFO, responseF] = await Promise.all([
          api.get('/fraquezas-ameacas-sh', { params: { page: 1, limit: 100 } }),
          api.get('/fraquezas-ameacas-ch', { params: { page: 1, limit: 100} }),
          api.get('/fraquezas-oportunidades', { params: { page: 1, limit: 100 } }),
          api.get('/forcas', { params: { page: 1, limit: 100 } })
        ]);

        // Processar perguntas CH com histórias sociais
        const perguntasCHComHistorias = await Promise.all(
          responseCH.data.registros.map(async (registro) => {
            try {
              const historiaResponse = await api.get('/historias-sociais', {
                params: {
                  numeroHistoria: registro.numHistoria,
                  page: 1,
                  limit: 1
                }
              });
              
              const historia = historiaResponse.data.registros?.[0] || null;
              
              return {
                ...registro,
                tipo: 'CH',
                historia: historia,
                introducao: historia?.introducao || null,
                titulo: historia?.titulo || null,
                personagem: historia?.personagem || null,
                ambientacao: historia?.ambientacao || null,
                historiaTexto: historia?.historia || null,
                questionamento: historia?.questionamento || null,
                perguntaIntensidade: historia?.perguntaIntensidade || null,
                intensidadeLeve: historia?.intensidadeLeve || null,
                intensidadeModerada: historia?.intensidadeModerada || null,
                intensidadeAlta: historia?.intensidadeAlta || null
              };
            } catch (historiaErr) {
              console.error(`Erro ao buscar história ${registro.numHistoria}:`, historiaErr);
              return {
                ...registro,
                tipo: 'CH',
                historia: null
              };
            }
          })
        );

        // Processar e ordenar todas as perguntas
        const perguntasSH = responseSH.data.registros
          .map(registro => ({ ...registro, tipo: 'SH' }))
          .sort((a, b) => a.numeroTraco - b.numeroTraco);

        const perguntasCHOrdenadas = perguntasCHComHistorias.sort(
          (a, b) => a.numeroTraco - b.numeroTraco
        );

        const perguntasFO = responseFO.data.registros
          .map(registro => ({
            ...registro,
            tipo: 'FO',
            tracoNeutro: registro.tracoNeutro?.map(t => t.valor) || [],
            tracoOportunidade: registro.tracoOportunidade?.map(t => t.valor) || [],
            tracoFraqueza: registro.tracoFraqueza?.map(t => t.valor) || []
          }))
          .sort((a, b) => a.numeroTraco - b.numeroTraco);

        const perguntasF = responseF.data.registros
          .map(registro => ({
            ...registro,
            tipo: 'F',
            tracoNeutro: registro.tracoNeutro?.map(t => t.valor) || [],
            tracoForca: registro.tracoForca?.map(t => t.valor) || [],
            tracoFraqueza: registro.tracoFraqueza?.map(t => t.valor) || [],
            tracoOportunidade: registro.tracoOportunidade?.map(t => t.valor) || []
          }))
          .sort((a, b) => a.numeroTraco - b.numeroTraco);

        // Combinar todas as perguntas
        const perguntasOrdenadas = [
          ...perguntasSH,
          ...perguntasCHOrdenadas,
          ...perguntasFO,
          ...perguntasF
        ];
        
        setPerguntas(perguntasOrdenadas);
      } catch (err) {
        console.error('Erro ao buscar perguntas:', err);
        setError('Erro ao carregar perguntas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    buscarPerguntas();
  }, []);

  return { perguntas, loading, error };
}

