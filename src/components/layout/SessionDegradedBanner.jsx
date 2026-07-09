import { useAuth } from '../../contexts/AuthContext';

function SessionDegradedBanner() {
  const { sessionDegraded } = useAuth();

  if (!sessionDegraded) return null;

  return (
    <div
      role="status"
      className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm text-center px-4 py-2"
    >
      Não foi possível validar sua sessão com o servidor. Alguns dados podem estar desatualizados.
      Verifique sua conexão e recarregue a página quando possível.
    </div>
  );
}

export default SessionDegradedBanner;
