import { useState } from 'react';

/**
 * Hook para gerenciar navegação e expansão de seções do SWOT
 */
export function useSwotNavigation(dadosSwot) {
  const [expandido, setExpandido] = useState(null);

  const isDesbloqueado = (secao) => {
    return dadosSwot[secao]?.items?.length > 0;
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

