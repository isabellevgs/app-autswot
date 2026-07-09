import { createContext, useState, useContext, useEffect, useCallback } from "react";
import * as authService from "../services/authService";
import {
  AUTH_SESSION_EXPIRED,
  AUTH_SESSION_EXPIRED_KEY,
} from "../utils/auth-events";

const defaultContextValue = {
  user: null,
  login: async () => {
    throw new Error("AuthContext não foi inicializado. Certifique-se de que o componente está dentro de um AuthProvider.");
  },
  register: async () => {
    throw new Error(
      "AuthContext não foi inicializado. Certifique-se de que o componente está dentro de um AuthProvider."
    );
  },
  logout: () => {
    throw new Error("AuthContext não foi inicializado. Certifique-se de que o componente está dentro de um AuthProvider.");
  },
  updateUserProfile: async () => {
    throw new Error("AuthContext não foi inicializado. Certifique-se de que o componente está dentro de um AuthProvider.");
  },
  loading: true,
  signed: false,
  sessionDegraded: false,
};

const AuthContext = createContext(defaultContextValue);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionDegraded, setSessionDegraded] = useState(false);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setSessionDegraded(false);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          const normalizedUser = {
            ...userData,
            role: userData.role ? String(userData.role).toUpperCase() : 'USER',
          };
          setUser(normalizedUser);
          setSessionDegraded(false);
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          const status = error?.response?.status;
          const isNetwork =
            !error?.response &&
            (error?.code === 'ECONNREFUSED' ||
              error?.code === 'ETIMEDOUT' ||
              error?.code === 'ERR_NETWORK');

          if (isNetwork || status >= 500) {
            const cached = authService.getUser();
            if (cached) {
              setUser({
                ...cached,
                role: cached.role ? String(cached.role).toUpperCase() : 'USER',
              });
              setSessionDegraded(true);
            }
          } else if (status === 401 || status === 403) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [logout]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === authService.ACCESS_TOKEN_KEY && !event.newValue) {
        logout();
      }
      if (event.key === authService.REFRESH_TOKEN_KEY && !event.newValue) {
        logout();
      }
      if (event.key === AUTH_SESSION_EXPIRED_KEY && event.newValue) {
        logout();
      }
    };

    const onSessionExpired = () => logout();

    window.addEventListener('storage', onStorage);
    window.addEventListener(AUTH_SESSION_EXPIRED, onSessionExpired);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(AUTH_SESSION_EXPIRED, onSessionExpired);
    };
  }, [logout]);

  const login = async (email, password) => {
    try {
      const { user: loggedUser } = await authService.loginUser(email, password);
      const normalizedUser = {
        ...loggedUser,
        role: loggedUser.role ? String(loggedUser.role).toUpperCase() : 'USER',
      };
      setUser(normalizedUser);
      setSessionDegraded(false);
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const register = async (registrationPayload) => {
    try {
      const { user } = await authService.registerUser(registrationPayload);

      try {
        const userData = await authService.getCurrentUser();
        const normalizedUser = {
          ...userData,
          role: userData.role ? String(userData.role).toUpperCase() : 'USER',
        };
        setUser(normalizedUser);
        setSessionDegraded(false);
      } catch (profileError) {
        console.warn('Registro concluído, mas falha ao sincronizar perfil:', profileError);
        const normalizedUser = {
          ...user,
          role: user.role ? String(user.role).toUpperCase() : 'USER',
        };
        setUser(normalizedUser);
      }

      return true;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  };

  const updateUserProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      const updatedUser = response.user;
      const normalizedUser = {
        ...updatedUser,
        role: updatedUser.role ? String(updatedUser.role).toUpperCase() : 'USER',
      };
      setUser(normalizedUser);
      setSessionDegraded(false);
      return normalizedUser;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  };

  const contextValue = {
    user,
    login,
    register,
    logout,
    updateUserProfile,
    loading,
    signed: !!user,
    sessionDegraded,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context || typeof context.login !== 'function') {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider. O contexto não foi inicializado corretamente.");
  }

  return context;
};
