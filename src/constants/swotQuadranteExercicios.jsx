/**
 * Exercícios reflexivos por quadrante SWOT (fixos ao final do modal).
 * Separado do conteúdo editorial dinâmico dos relatórios.
 */

import { QUESTOES_AMEACA_FRAQUEZA } from './relatorioAmeacaFraqueza.jsx';
import { QUESTOES_OPORTUNIDADE } from './relatorioOportunidade.jsx';

export const TITULO_EXERCICIOS =
  'Exercícios de autoconhecimento e delineamento de estratégias.';

export const INTRO_EXERCICIOS_POR_QUADRANTE = {
  ameaca:
    'Responda as questões abaixo para descobrir como esse traço impacta negativamente na sua vida e o que pode ser feito para reduzir ou evitar tal impacto.',
  fraqueza:
    'Responda as questões abaixo para descobrir como esse traço impacta negativamente na sua vida e o que pode ser feito para reduzir ou evitar tal impacto.',
  oportunidade:
    'Responda as questões abaixo para descobrir como esse traço pode se tornar uma força caso seja trabalhado.',
  forca: null,
};

export const QUESTOES_POR_QUADRANTE = {
  ameaca: QUESTOES_AMEACA_FRAQUEZA,
  fraqueza: QUESTOES_AMEACA_FRAQUEZA,
  oportunidade: QUESTOES_OPORTUNIDADE,
  forca: [],
};

export function introExercicios(quadrante) {
  return INTRO_EXERCICIOS_POR_QUADRANTE[quadrante] ?? null;
}

export function questoesDoQuadrante(quadrante) {
  return QUESTOES_POR_QUADRANTE[quadrante] ?? [];
}

export function quadranteTemExercicios(quadrante) {
  return questoesDoQuadrante(quadrante).length > 0;
}
