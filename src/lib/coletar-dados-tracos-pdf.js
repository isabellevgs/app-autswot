import api from '../services/api';
import { SWOT_ORDEM } from '../constants/swotConfig';

async function fetchDetalhe(tipo, numeroTraco) {
  if (tipo === 'SH') {
    return api.get(`/relatorio-sh/${numeroTraco}`).catch(() => null);
  }
  if (tipo === 'CH') {
    return api.get(`/relatorio-ch/${numeroTraco}`).catch(() => null);
  }
  return api.get(`/traco-detalhe/${tipo}/${numeroTraco}`).catch(() => null);
}

async function fetchReflexao(tipo, numeroTraco, quadrante) {
  return api
    .get(`/reflexao-traco/${tipo}/${numeroTraco}/${quadrante}`)
    .catch(() => null);
}

/**
 * Busca detalhes editoriais + respostas de todos os traços presentes no SWOT.
 * @param {object} dadosSwot — saída do useSwot (items com tipo, numeroTraco, quadrante, label)
 */
export async function coletarDadosTracosParaPdf(dadosSwot) {
  const tracos = [];

  for (const secaoKey of SWOT_ORDEM) {
    const items = dadosSwot[secaoKey]?.items ?? [];
    for (const item of items) {
      const { tipo, numeroTraco, quadrante, label } = item;
      const [resDetalhe, resReflexao] = await Promise.all([
        fetchDetalhe(tipo, numeroTraco),
        fetchReflexao(tipo, numeroTraco, quadrante),
      ]);

      tracos.push({
        label: label ?? resDetalhe?.data?.titulo ?? `Traço ${numeroTraco}`,
        tipo,
        numeroTraco,
        quadrante,
        detalhe: resDetalhe?.data ?? null,
        respostas: resReflexao?.data?.respostas ?? {},
      });
    }
  }

  return tracos;
}
