import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AUTH_SESSION_EXPIRED } from "../utils/auth-events";
import PrivateRoute from "./PrivateRoute";
import QuestionarioCompletoGuard from "./QuestionarioCompletoGuard";
import RequireAcessoLiberado from "./RequireAcessoLiberado";

// Importar páginas
import Home from "../pages/home";
import Login from "../pages/login";
import Cadastrar from "../pages/cadastrar";
import Questionario from "../pages/questionario";
import Swot from "../pages/swot";
import Diario from "../pages/diario";
import Conteudo from "../pages/conteudo";
import PostDetail from "../pages/post-detail";
import Perfil from "../pages/perfil";

const SessionExpiredHandler = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handler = () => {
      sessionStorage.setItem('autswot:session-message', 'Sua sessão expirou. Faça login novamente.');
      logout();
      navigate('/login', { replace: true });
    };
    window.addEventListener(AUTH_SESSION_EXPIRED, handler);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED, handler);
  }, [logout, navigate]);

  return null;
};

const AppRoutes = () => {
  const { signed } = useAuth();

  return (
    <>
      <SessionExpiredHandler />
      <Routes>
      {/* Rotas públicas - Autenticação */}
      <Route 
        path="/login" 
        element={signed ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/cadastrar" 
        element={signed ? <Navigate to="/" replace /> : <Cadastrar />} 
      />

      {/* Rotas protegidas - Requerem autenticação */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/questionario"
        element={
          <PrivateRoute>
            <RequireAcessoLiberado>
              <Questionario />
            </RequireAcessoLiberado>
          </PrivateRoute>
        }
      />
      <Route
        path="/resultados"
        element={
          <PrivateRoute>
            <QuestionarioCompletoGuard>
              <RequireAcessoLiberado>
                <Swot />
              </RequireAcessoLiberado>  
            </QuestionarioCompletoGuard>
          </PrivateRoute>
        }
      />
      <Route
        path="/diario"
        element={
          <PrivateRoute>
            <RequireAcessoLiberado>
              <Diario />
            </RequireAcessoLiberado>
          </PrivateRoute>
        }
      />
      <Route
        path="/conteudo"
        element={
          <PrivateRoute>
            <Conteudo />
          </PrivateRoute>
        }
      />
      <Route
        path="/conteudo/post/:id"
        element={
          <PrivateRoute>
            <PostDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />

      {/* Rota 404 - Página não encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
};

export default AppRoutes;

