import { quadranteTemExercicios } from '../constants/swotQuadranteExercicios.jsx';
import {
  SECAO_POR_QUADRANTE,
  tracosNecessariosParaDesbloquearProximo,
} from '../constants/swotQuadrantes';

const QUADRANTES_COM_EXERCICIOS = ['ameaca', 'fraqueza', 'oportunidade'];

/** Meta de envios no quadrante para desbloquear o próximo (5 / 3 / 2, ou menos se houver poucos traços). */
export function metaEnvioQuadrante(quadrante, dadosSwot, progresso) {
  if (progresso?.[quadrante]?.necessarios != null) {
    return progresso[quadrante].necessarios;
  }
  const secao = SECAO_POR_QUADRANTE[quadrante];
  const total = dadosSwot?.[secao]?.items?.length ?? 0;
  return tracosNecessariosParaDesbloquearProximo(quadrante, total);
}

function totalTracos(progresso) {
  if (!progresso) return 0;
  return QUADRANTES_COM_EXERCICIOS.reduce(
    (acc, q) => acc + (progresso[q]?.totalTracos ?? 0),
    progresso.forca?.totalTracos ?? 0,
  );
}

/**
 * PDF disponível quando há traços na SWOT e todos os exercícios dos quadrantes
 * com reflexão foram enviados; se houver forças, o quadrante deve estar desbloqueado.
 */
export function reflexoesCompletasParaPdf(progresso) {
  if (!progresso || totalTracos(progresso) === 0) return false;

  for (const quadrante of QUADRANTES_COM_EXERCICIOS) {
    if (!quadranteTemExercicios(quadrante)) continue;

    const total = progresso[quadrante]?.totalTracos ?? 0;
    if (total <= 0) continue;

    const concluidos = progresso[quadrante]?.concluidos ?? 0;
    if (concluidos < total) return false;
  }

  const totalForcas = progresso.forca?.totalTracos ?? 0;
  if (totalForcas > 0 && !progresso.forca?.desbloqueado) return false;

  return true;
}
