import { SwotCard } from '../index';
import { SWOT_ORDEM } from '../../constants/swotConfig';

/**
 * Componente que renderiza o grid de cards SWOT
 */
function SwotGrid({ dadosSwot, expandido, onToggleSecao, isDesbloqueado }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {SWOT_ORDEM.map((secao) => {
        if (expandido === secao) return null;
        
        const data = dadosSwot[secao];
        return (
          <SwotCard
            key={secao}
            titulo={data.titulo}
            Icon={data.icon}
            items={data.items}
            isExpandido={false}
            isBloqueado={!isDesbloqueado(secao)}
            onClick={() => onToggleSecao(secao)}
            gradient={data.gradient}
          />
        );
      })}
    </div>
  );
}

export default SwotGrid;

