/** Chave única de uma reflexão por traço + quadrante. */
export function chaveReflexaoTraco({ tipo, numeroTraco, quadrante }) {
  return `${tipo}-${numeroTraco}-${quadrante}`;
}

/**
 * Mapa tipo-numeroTraco-quadrante → 'enviado' | 'rascunho'
 * @param {Array<{ tipo: string, numeroTraco: number, quadrante: string, enviado?: boolean }>} reflexoes
 */
export function mapaStatusReflexoes(reflexoes) {
  const map = {};
  for (const r of reflexoes ?? []) {
    map[chaveReflexaoTraco(r)] = r.enviado ? 'enviado' : 'rascunho';
  }
  return map;
}
