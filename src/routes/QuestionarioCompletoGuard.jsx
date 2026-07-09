import { Navigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useProgresso } from '../hooks/useProgresso';

/**
 * Só renderiza filhos quando o questionário estiver 100% completo.
 */
function QuestionarioCompletoGuard({ children }) {
  const { status, loading, error, recarregar } = useProgresso();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
          <p className="text-gray-700 font-semibold">Verificando questionário...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600" />
          <p className="text-red-600 font-semibold">{error}</p>
          <p className="text-sm text-gray-600">
            Não foi possível verificar se o questionário está completo. Tente novamente.
          </p>
          <button
            type="button"
            onClick={recarregar}
            className="px-6 py-3 rounded-xl bg-violet-700 text-white font-semibold hover:bg-violet-800 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (status !== 'concluido') {
    return <Navigate to="/questionario" replace />;
  }

  return children;
}

export default QuestionarioCompletoGuard;
