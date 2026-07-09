import { quadranteTemExercicios } from '../constants/swotQuadranteExercicios.jsx';

const QUADRANTES_COM_EXERCICIOS = ['ameaca', 'fraqueza', 'oportunidade'];

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
