import api from '../services/api';
import { QUESTIONARIO_PAGE_LIMIT } from './questionarioValidation';

const HISTORIA_MAX_TENTATIVAS = 3;
const HISTORIA_RETRY_MS = 600;

function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buscarHistoriaComRetry(numeroHistoria) {
  for (let tentativa = 1; tentativa <= HISTORIA_MAX_TENTATIVAS; tentativa++) {
    try {
      const historiaResponse = await api.get('/historias-sociais', {
        params: {
          numeroHistoria,
          page: 1,
          limit: 1,
        },
        timeout: 30000,
      });

      const historia = historiaResponse.data?.registros?.[0] ?? null;
      if (historia) {
        return { historia, historiaIndisponivel: false };
      }
    } catch (historiaErr) {
      console.error(
        `Erro ao buscar história ${numeroHistoria} (tentativa ${tentativa}/${HISTORIA_MAX_TENTATIVAS}):`,
        historiaErr,
      );
    }

    if (tentativa < HISTORIA_MAX_TENTATIVAS) {
      await aguardar(HISTORIA_RETRY_MS * tentativa);
    }
  }

  return { historia: null, historiaIndisponivel: true };
}

function montarPerguntaCH(registro, historia, historiaIndisponivel) {
  return {
    ...registro,
    tipo: 'CH',
    historia,
    historiaIndisponivel,
    introducao: historia?.introducao || null,
    titulo: historia?.titulo || null,
    personagem: historia?.personagem || null,
    ambientacao: historia?.ambientacao || null,
    historiaTexto: historia?.historia || null,
    questionamento: historia?.questionamento || null,
    perguntaIntensidade: historia?.perguntaIntensidade || null,
    intensidadeLeve: historia?.intensidadeLeve || null,
    intensidadeModerada: historia?.intensidadeModerada || null,
    intensidadeAlta: historia?.intensidadeAlta || null,
  };
}

/**
 * Busca e monta a lista completa de perguntas do questionário.
 * Compartilhado entre usePerguntas e useProgresso para garantir consistência.
 */
export async function fetchPerguntas() {
  const params = { page: 1, limit: QUESTIONARIO_PAGE_LIMIT };

  const [responseSH, responseCH, responseFO, responseF] = await Promise.all([
    api.get('/fraquezas-ameacas-sh', { params }),
    api.get('/fraquezas-ameacas-ch', { params }),
    api.get('/fraquezas-oportunidades', { params }),
    api.get('/forcas', { params }),
  ]);

  const registrosSH = responseSH?.data?.registros || [];
  const registrosCH = responseCH?.data?.registros || [];
  const registrosFO = responseFO?.data?.registros || [];
  const registrosF = responseF?.data?.registros || [];

  const perguntasCHComHistorias = await Promise.all(
    registrosCH.map(async (registro) => {
      const { historia, historiaIndisponivel } = await buscarHistoriaComRetry(registro.numHistoria);
      return montarPerguntaCH(registro, historia, historiaIndisponivel);
    }),
  );

  const perguntasSH = registrosSH
    .map((registro) => ({ ...registro, tipo: 'SH' }))
    .sort((a, b) => a.numeroTraco - b.numeroTraco);

  const perguntasCHOrdenadas = perguntasCHComHistorias.sort(
    (a, b) => a.numeroTraco - b.numeroTraco,
  );

  const perguntasFO = registrosFO
    .map((registro) => ({
      ...registro,
      tipo: 'FO',
      tracoNeutro: registro.tracoNeutro?.map((t) => t.valor) || [],
      tracoOportunidade: registro.tracoOportunidade?.map((t) => t.valor) || [],
      tracoFraqueza: registro.tracoFraqueza?.map((t) => t.valor) || [],
    }))
    .sort((a, b) => a.numeroTraco - b.numeroTraco);

  const perguntasF = registrosF
    .map((registro) => ({
      ...registro,
      tipo: 'F',
      tracoNeutro: registro.tracoNeutro?.map((t) => t.valor) || [],
      tracoForca: registro.tracoForca?.map((t) => t.valor) || [],
      tracoFraqueza: registro.tracoFraqueza?.map((t) => t.valor) || [],
      tracoOportunidade: registro.tracoOportunidade?.map((t) => t.valor) || [],
    }))
    .sort((a, b) => a.numeroTraco - b.numeroTraco);

  return [...perguntasSH, ...perguntasCHOrdenadas, ...perguntasFO, ...perguntasF];
}
