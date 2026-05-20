import { useState } from 'react';

/**
 * Hook para gerenciar navegação e expansão de seções do SWOT
 */
export function useSwotNavigation(dadosSwot) {
  const [expandido, setExpandido] = useState(null);
  const SECAO_LIBERADA = 'ameacas';

  const isDesbloqueado = (secao) => {
    return secao === SECAO_LIBERADA && dadosSwot[secao]?.items?.length > 0;
  };

  const toggleSecao = (secao) => {
    if (isDesbloqueado(secao)) {
      setExpandido(expandido === secao ? null : secao);
    }
  };

  return {
    expandido,
    toggleSecao,
    isDesbloqueado
  };
}

