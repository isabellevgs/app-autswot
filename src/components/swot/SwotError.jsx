import { AlertCircle } from 'lucide-react';
import { PageContainer } from '../index';

/**
 * Componente de erro para a página SWOT
 */
function SwotError({ error, onRetry, retrying = false }) {
  return (
    <PageContainer className="pb-12">
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 px-6 max-w-md mx-auto text-center">
        <AlertCircle className="w-12 h-12 text-red-600" />
        <p className="text-red-600 text-lg">{error}</p>
        {onRetry && (
          <>
            <p className="text-sm text-gray-600">
              Verifique sua conexão e tente carregar os resultados novamente.
            </p>
            <button
              type="button"
              onClick={onRetry}
              disabled={retrying}
              className="px-6 py-3 rounded-xl bg-violet-700 text-white font-semibold hover:bg-violet-800 disabled:opacity-60 transition-colors"
            >
              {retrying ? 'Carregando…' : 'Tentar novamente'}
            </button>
          </>
        )}
      </div>
    </PageContainer>
  );
}

export default SwotError;
