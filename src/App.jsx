import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Topbar from './components/layout/Topbar';
import AppRoutes from './routes/AppRoutes';

// Componente interno para controlar a exibição da Topbar
function AppContent() {
  const location = useLocation();
  const rotasSemTopbar = ['/login', '/cadastrar'];
  const mostrarTopbar = !rotasSemTopbar.includes(location.pathname);

  return (
    <>
      {mostrarTopbar && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Topbar />
        </div>
      )}
      <div className={mostrarTopbar ? "max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8" : ""}>
        <AppRoutes />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
