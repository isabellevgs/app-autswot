/**
 * Utilitários para processamento de dados SWOT
 */

/**
 * Mapeia um traço da API para formato de exibição
 */
export function mapearTraco(traco) {
  // Se o campo swot existir e não estiver vazio, usa ele. Caso contrário, usa o formato antigo
  if (traco.swot && traco.swot.trim() !== '') {
    return traco.swot;
  }
  
  const tipoLabel = {
    'SH': 'Fraquezas e Ameaças SH',
    'CH': 'Fraquezas e Ameaças CH',
    'FO': 'Fraquezas e Oportunidades',
    'F': 'Forças'
  }[traco.tipo] || traco.tipo;
  
  return `Traço ${traco.numeroTraco} - ${tipoLabel}`;
}

/**
 * Transforma dados da API em formato de módulos SWOT
 */
export function transformarDadosSwot(swotData) {
  // Função auxiliar para mapear e filtrar itens válidos
  const mapearEFiltrar = (array) => {
    if (!array || !Array.isArray(array)) return [];
    return array
      .map(mapearTraco)
      .filter(item => item && item.trim() !== ''); // Remove itens vazios ou null
  };

  return {
    ameacas: {
      items: mapearEFiltrar(swotData.ameacas)
    },
    fraquezas: {
      items: mapearEFiltrar(swotData.fraquezas)
    },
    oportunidades: {
      items: mapearEFiltrar(swotData.oportunidades)
    },
    forcas: {
      items: mapearEFiltrar(swotData.forcas)
    }
  };
}

