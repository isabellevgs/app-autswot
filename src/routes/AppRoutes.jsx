import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";

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

const AppRoutes = () => {
  const { signed } = useAuth();

  return (
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
            <Questionario />
          </PrivateRoute>
        }
      />
      <Route
        path="/resultados"
        element={
          <PrivateRoute>
            <Swot />
          </PrivateRoute>
        }
      />
      <Route
        path="/diario"
        element={
          <PrivateRoute>
            <Diario />
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
  );
};

export default AppRoutes;

