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

        // Validar se as respostas têm a estrutura esperada
        const registrosSH = responseSH?.data?.registros || [];
        const registrosCH = responseCH?.data?.registros || [];
        const registrosFO = responseFO?.data?.registros || [];
        const registrosF = responseF?.data?.registros || [];

        // Processar perguntas CH com histórias sociais
        const perguntasCHComHistorias = await Promise.all(
          registrosCH.map(async (registro) => {
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
        const perguntasSH = registrosSH
          .map(registro => ({ ...registro, tipo: 'SH' }))
          .sort((a, b) => a.numeroTraco - b.numeroTraco);

        const perguntasCHOrdenadas = perguntasCHComHistorias.sort(
          (a, b) => a.numeroTraco - b.numeroTraco
        );

        const perguntasFO = registrosFO
          .map(registro => ({
            ...registro,
            tipo: 'FO',
            tracoNeutro: registro.tracoNeutro?.map(t => t.valor) || [],
            tracoOportunidade: registro.tracoOportunidade?.map(t => t.valor) || [],
            tracoFraqueza: registro.tracoFraqueza?.map(t => t.valor) || []
          }))
          .sort((a, b) => a.numeroTraco - b.numeroTraco);

        const perguntasF = registrosF
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
        console.error('Detalhes do erro:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
        setError(err.response?.data?.error || err.response?.data?.message || 'Erro ao carregar perguntas. Tente novamente mais tarde.');
        setPerguntas([]);
      } finally {
        setLoading(false);
      }
    };

    buscarPerguntas();
  }, []);

  return { perguntas, loading, error };
}

