import { SwotCard } from '../index';

/**
 * Componente que renderiza o card expandido do SWOT
 */
function SwotExpanded({ secao, dadosSwot, onToggleSecao }) {
  if (!secao || !dadosSwot[secao]) return null;

  const data = dadosSwot[secao];
  
  return (
    <SwotCard
      titulo={data.titulo}
      Icon={data.icon}
      items={data.items}
      isExpandido={true}
      isBloqueado={false}
      onClick={() => onToggleSecao(secao)}
      gradient={data.gradient}
    />
  );
}

export default SwotExpanded;

