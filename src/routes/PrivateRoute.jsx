import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Componente de rota protegida
// Permite acesso se o usuário estiver autenticado e for USER ou SUPER_USER
const PrivateRoute = ({ children }) => {
  const { signed, user, loading } = useAuth();

  // Enquanto verifica a autenticação, pode mostrar um loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  // Verificar se o usuário tem permissão (USER ou SUPER_USER)
  // Normalizar o role para garantir comparação correta
  // Se o role não existir ou for inválido, tratar como sem permissão
  let userRole = null;
  if (user?.role) {
    try {
      userRole = String(user.role).trim().toUpperCase();
    } catch (e) {
      console.error('❌ [DEBUG] PrivateRoute (app) - Erro ao normalizar role:', e);
      userRole = null;
    }
  }
  
  // Debug: log do role do usuário
  if (user) {
    console.log('🔍 [DEBUG] PrivateRoute (app) - Role do usuário:', user.role, 'Normalizado:', userRole, 'Tipo:', typeof user.role);
  }
  
  // Verificar se o usuário tem permissão válida
  if (user && (!userRole || (userRole !== 'USER' && userRole !== 'SUPER_USER'))) {
    console.error('❌ [DEBUG] PrivateRoute (app) - Role inválido:', userRole, 'Esperado: USER ou SUPER_USER', 'User completo:', user);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta aplicação.
          </p>
          <button
            onClick={() => {
              window.location.href = '/login';
            }}
            className="px-6 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  // Se estiver autenticado e for USER ou SUPER_USER, renderiza o componente filho
  return children;
};

export default PrivateRoute;

