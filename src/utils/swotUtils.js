/**
 * Utilitários para processamento de dados SWOT
 */

const TIPO_LABEL = {
  SH: 'Fraquezas e Ameaças SH',
  CH: 'Fraquezas e Ameaças CH',
  FO: 'Fraquezas e Oportunidades',
  F:  'Forças',
};

/**
 * Mapeia um traço da API para objeto de exibição (com quadrante)
 * @param {object} traco - dados vindos da API
 * @param {string} quadrante - 'ameaca' | 'fraqueza' | 'oportunidade' | 'forca'
 */
export function mapearTraco(traco, quadrante) {
  const label =
    traco.swot && traco.swot.trim() !== ''
      ? traco.swot
      : `Traço ${traco.numeroTraco} - ${TIPO_LABEL[traco.tipo] || traco.tipo}`;

  return {
    label,
    tipo:        traco.tipo,
    numeroTraco: traco.numeroTraco,
    perguntaId:  traco.perguntaId,
    quadrante,
  };
}

/**
 * Transforma dados da API em formato de módulos SWOT.
 * Os items retornados são objetos { label, tipo, numeroTraco, perguntaId, quadrante }.
 */
export function transformarDadosSwot(swotData) {
  const mapear = (array, quadrante) => {
    if (!Array.isArray(array)) return [];
    return array
      .map((t) => mapearTraco(t, quadrante))
      .filter((item) => item.label && item.label.trim() !== '');
  };

  return {
    ameacas:      { items: mapear(swotData.ameacas,      'ameaca')      },
    fraquezas:    { items: mapear(swotData.fraquezas,    'fraqueza')    },
    oportunidades:{ items: mapear(swotData.oportunidades,'oportunidade') },
    forcas:       { items: mapear(swotData.forcas,       'forca')       },
  };
}
