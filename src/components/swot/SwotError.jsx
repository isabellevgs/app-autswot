import { PageContainer } from '../index';

/**
 * Componente de erro para a página SWOT
 */
function SwotError({ error }) {
  return (
    <PageContainer className="pb-12">
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 px-6">
        <p className="text-red-600 text-lg text-center">{error}</p>
      </div>
    </PageContainer>
  );
}

export default SwotError;

