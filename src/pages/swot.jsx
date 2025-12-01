import { PageContainer, SectionHeader } from '../components';
import { useSwot } from '../hooks/useSwot';
import { useSwotNavigation } from '../hooks/useSwotNavigation';
import SwotLoading from '../components/swot/SwotLoading';
import SwotError from '../components/swot/SwotError';
import SwotExpanded from '../components/swot/SwotExpanded';
import SwotGrid from '../components/swot/SwotGrid';

function Swot() {
  const { dadosSwot, loading, error } = useSwot();
  const { expandido, toggleSecao, isDesbloqueado } = useSwotNavigation(dadosSwot);

  if (loading) {
    return <SwotLoading />;
  }

  if (error) {
    return <SwotError error={error} />;
  }

  return (
    <PageContainer className="pb-12">
      <SectionHeader 
        title="Resultados" 
        subtitle="Clique em cada categoria para explorar os detalhes"
      />

      <div className="px-6 sm:px-10 md:px-16 lg:px-20 xl:px-32 max-w-6xl mx-auto space-y-6">
        <SwotExpanded 
          secao={expandido}
          dadosSwot={dadosSwot}
          onToggleSecao={toggleSecao}
        />

        <SwotGrid
          dadosSwot={dadosSwot}
          expandido={expandido}
          onToggleSecao={toggleSecao}
          isDesbloqueado={isDesbloqueado}
        />
      </div>
    </PageContainer>
  );
}

export default Swot;
