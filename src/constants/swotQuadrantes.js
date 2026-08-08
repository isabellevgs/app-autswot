/**
 * Regras dos quadrantes SWOT (desbloqueio, ordem, mapeamento UI ↔ API).
 * Separado da configuração editorial dos relatórios por traço.
 */

/** true = desbloqueio sequencial obrigatório (ameaças → fraquezas → oportunidades → forças). */
export const DESBLOQUEIO_SEQUENCIAL_ATIVO = true;

/** Chaves usadas na API e no banco (singular). */
export const QUADRANTES_ORDEM = ['ameaca', 'fraqueza', 'oportunidade', 'forca'];

/** Chaves das seções no grid da UI (plural). */
export const SECAO_POR_QUADRANTE = {
  ameaca: 'ameacas',
  fraqueza: 'fraquezas',
  oportunidade: 'oportunidades',
  forca: 'forcas',
};

export const QUADRANTE_POR_SECAO = Object.fromEntries(
  Object.entries(SECAO_POR_QUADRANTE).map(([quadrante, secao]) => [secao, quadrante]),
);

/**
 * Traços respondidos no quadrante anterior necessários para desbloquear este.
 * Ameaças = 0 → sempre desbloqueado.
 */
export const TRACOS_PARA_DESBLOQUEAR = {
  ameaca: 0,
  fraqueza: 5,
  oportunidade: 3,
  forca: 2,
};

/** Quadrante predecessor na cadeia de desbloqueio. */
export const QUADRANTE_ANTERIOR = {
  ameaca: null,
  fraqueza: 'ameaca',
  oportunidade: 'fraqueza',
  forca: 'oportunidade',
};

/**
 * Traços que o usuário deve responder neste quadrante para desbloquear o próximo.
 * (Ameaças → 5 abre Fraquezas; Fraquezas → 3 abre Oportunidades; etc.)
 */
export const TRACOS_PARA_DESBLOQUEAR_PROXIMO = {
  ameaca: TRACOS_PARA_DESBLOQUEAR.fraqueza,
  fraqueza: TRACOS_PARA_DESBLOQUEAR.oportunidade,
  oportunidade: TRACOS_PARA_DESBLOQUEAR.forca,
  forca: 0,
};

export function tracosNecessariosParaDesbloquear(quadrante, totalTracosQuadranteAnterior = 0) {
  const configurado = TRACOS_PARA_DESBLOQUEAR[quadrante] ?? 0;
  if (!QUADRANTE_ANTERIOR[quadrante]) return 0;
  if (totalTracosQuadranteAnterior <= 0) return 0;
  return Math.min(configurado, totalTracosQuadranteAnterior);
}

export function tracosNecessariosParaDesbloquearProximo(quadrante, totalTracosQuadrante = 0) {
  const configurado = TRACOS_PARA_DESBLOQUEAR_PROXIMO[quadrante] ?? 0;
  if (configurado === 0) return 0;
  if (totalTracosQuadrante <= 0) return 0;
  return Math.min(configurado, totalTracosQuadrante);
}

export function quadranteEstaDesbloqueado(
  quadrante,
  concluidosPorQuadrante = {},
  totalTracosPorQuadrante = {},
) {
  if (!DESBLOQUEIO_SEQUENCIAL_ATIVO) return true;
  const anterior = QUADRANTE_ANTERIOR[quadrante];
  if (!anterior) return true;
  const totalAnterior = totalTracosPorQuadrante[anterior] ?? 0;  
  const necessarios = tracosNecessariosParaDesbloquear(quadrante, totalAnterior);
  if (necessarios === 0) return true;
  let concluidos = concluidosPorQuadrante[anterior] ?? 0;
  return (concluidos >= necessarios || concluidos == totalAnterior);
}

export function tracosFaltandoParaDesbloquear(
  quadrante,
  concluidosPorQuadrante = {},
  totalTracosPorQuadrante = {},
) {
  const anterior = QUADRANTE_ANTERIOR[quadrante];
  if (!anterior) return 0;
  const totalAnterior = totalTracosPorQuadrante[anterior] ?? 0;
  const necessarios = tracosNecessariosParaDesbloquear(quadrante, totalAnterior);
  if (necessarios === 0) return 0;
  let concluidos = concluidosPorQuadrante[anterior] ?? 0;
  if (concluidos == totalAnterior) return 0;
  
  return Math.max(0, necessarios - concluidos);
}

export const REGRAS_DESBLOQUEIO = [
  {
    quadrante: 'ameaca',
    ordem: 1,
    titulo: 'Ameaças',
    sempreDesbloqueado: true,
    tracosNoAnterior: 0,
  },
  {
    quadrante: 'fraqueza',
    ordem: 2,
    titulo: 'Fraquezas',
    tracosNoAnterior: TRACOS_PARA_DESBLOQUEAR.fraqueza,
    quadranteAnterior: 'ameaca',
    quadranteAnteriorTitulo: 'Ameaças',
  },
  {
    quadrante: 'oportunidade',
    ordem: 3,
    titulo: 'Oportunidades',
    tracosNoAnterior: TRACOS_PARA_DESBLOQUEAR.oportunidade,
    quadranteAnterior: 'fraqueza',
    quadranteAnteriorTitulo: 'Fraquezas',
  },
  {
    quadrante: 'forca',
    ordem: 4,
    titulo: 'Forças',
    tracosNoAnterior: TRACOS_PARA_DESBLOQUEAR.forca,
    quadranteAnterior: 'oportunidade',
    quadranteAnteriorTitulo: 'Oportunidades',
  },
];

export const QUADRANTES_COM_EXERCICIOS = ['ameaca', 'fraqueza', 'oportunidade'];
export const quadrantesExerMinimos = new Map([
  ['ameaca', 5],
  ['fraqueza', 3],
  ['oportunidade', 2]
]);

export function fezExerciciosMinimos(progresso){
  for (const quadrante of QUADRANTES_COM_EXERCICIOS) {
    if (!fezExerciciosMinimosQuad(progresso, quadrante)) return false;
  }
  return true;
}

export function fezExerciciosMinimosQuad(progresso, quadrante){
  const total = progresso[quadrante]?.totalTracos ?? 0;
  if (total <= 0) return true;
  
  const concluidos = progresso[quadrante]?.concluidos ?? 0;
  return (concluidos >= quadrantesExerMinimos.get(quadrante) || concluidos == total);
}
