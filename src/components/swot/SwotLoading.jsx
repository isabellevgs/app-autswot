import { Loader2 } from 'lucide-react';
import { PageContainer } from '../index';

/**
 * Componente de loading para a página SWOT
 */
function SwotLoading() {
  return (
    <PageContainer className="pb-12">
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
        <p className="text-gray-700 text-lg">Carregando resultados...</p>
      </div>
    </PageContainer>
  );
}

export default SwotLoading;

