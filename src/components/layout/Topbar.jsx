import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function Topbar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-violet-700 to-violet-800 px-6 py-4 rounded-2xl mt-5 shadow-lg">
      <nav className="flex flex-wrap items-center justify-between gap-4" aria-label="Navegação principal">
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-white font-bold text-2xl sm:text-3xl tracking-wide hover:text-violet-200 transition-colors duration-200 cursor-pointer">
                AutSWOT
              </h1>
            </Link>
          </div>

          {/* Menu de Navegação */}
          <ul className="flex flex-wrap items-center gap-6 lg:gap-8">
            <li>
              <Link
                to="/questionario"
                className={`text-white font-semibold text-base sm:text-lg hover:text-violet-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-violet-700 rounded px-3 py-1.5 ${
                  location.pathname === '/questionario' ? 'text-violet-200' : ''
                }`}
                aria-current={location.pathname === '/questionario' ? 'page' : undefined}
              >
                Questionário
              </Link>
            </li>
            <li>
              <Link
                to="/diario"
                className={`text-white font-semibold text-base sm:text-lg hover:text-violet-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-violet-700 rounded px-3 py-1.5 ${
                  location.pathname === '/diario' ? 'text-violet-200' : ''
                }`}
                aria-current={location.pathname === '/diario' ? 'page' : undefined}
              >
                Diário
              </Link>
            </li>
            <li>
              <Link
                to="/conteudo"
                className={`text-white font-semibold text-base sm:text-lg hover:text-violet-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-violet-700 rounded px-3 py-1.5 ${
                  location.pathname === '/conteudo' ? 'text-violet-200' : ''
                }`}
                aria-current={location.pathname === '/conteudo' ? 'page' : undefined}
              >
                Conteúdo
              </Link>
            </li>
          </ul>
        </div>

        {/* Perfil do Usuário */}
        <Link 
          to="/perfil"
          className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 transition-colors duration-200 px-4 py-2 rounded-lg cursor-pointer"
        >
          <User className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-base sm:text-lg whitespace-nowrap">
            Olá, {user?.name || 'Usuário'}
          </span>
        </Link>
      </nav>
    </header>
  )
}

export default Topbar