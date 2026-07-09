// Gerenciamento de autenticação e tokens JWT
import api from './api';
import { extrairErroApi } from '../utils/api-errors';

const apiUrl = () => api.defaults.baseURL ?? import.meta.env.VITE_API_URL ?? '';

function limparCacheQuestionario() {
  import('../utils/questionarioCache.js').then(({ invalidateQuestionarioCache }) => {
    invalidateQuestionarioCache();
  });
}

export const ACCESS_TOKEN_KEY = "@autswot-access-token";
export const REFRESH_TOKEN_KEY = "@autswot-refresh-token";
export const USER_KEY = "@autswot-user";

// Verifica se há um token no localStorage (usuário logado)
export const isAuthenticated = () => localStorage.getItem(ACCESS_TOKEN_KEY) !== null;

// Pega o access token do localStorage
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

// Pega o refresh token do localStorage
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

// Pega o usuário do localStorage
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Salva os tokens e dados do usuário (login)
export const saveAuth = (accessToken, refreshToken, user) => {
  limparCacheQuestionario();
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Remove os tokens e dados do usuário (logout)
export const logout = () => {
  limparCacheQuestionario();
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Retrocompatibilidade: ainda suporta TOKEN_KEY antigo
export const TOKEN_KEY = ACCESS_TOKEN_KEY;
export const getToken = getAccessToken;

// ============================================
// FUNÇÕES DE API
// ============================================

/**
 * Faz login do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<{user: Object, token: string}>}
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = response.data;
    
    // Normalizar o role antes de salvar
    const normalizedUser = {
      ...user,
      role: user.role ? String(user.role).toUpperCase() : 'USER',
    };
    
    // Salvar tokens e dados do usuário
    saveAuth(accessToken, refreshToken, normalizedUser);
    
    return {
      ...response.data,
      user: normalizedUser,
    };
  } catch (error) {
    console.error('Erro no login:', error);
    if (error.response?.status === 429) {
      throw new Error('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
    }
    throw new Error(extrairErroApi(error, 'Erro ao fazer login'));
  }
};

/**
 * Registra um novo usuário (nome, e-mail, senha e ficha sociodemográfica)
 * @param {Object} registrationPayload - Corpo completo conforme API /auth/register
 * @returns {Promise<{user: Object, accessToken: string, refreshToken: string}>}
 */
export const registerUser = async (registrationPayload) => {
  try {
    const response = await api.post('/auth/register', registrationPayload);
    const { user, accessToken, refreshToken } = response.data;
    
    // Normalizar o role antes de salvar
    const normalizedUser = {
      ...user,
      role: user.role ? String(user.role).toUpperCase() : 'USER',
    };
    
    // Salvar tokens e dados do usuário
    saveAuth(accessToken, refreshToken, normalizedUser);
    
    return {
      ...response.data,
      user: normalizedUser,
    };
  } catch (error) {
    console.error('Erro no registro:', error);
    throw new Error(extrairErroApi(error, 'Erro ao criar conta'));
  }
};

/**
 * Busca dados do usuário atual
 * @returns {Promise<Object>}
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    const { user } = response.data;
    
    // Normalizar o role antes de salvar
    const normalizedUser = {
      ...user,
      role: user.role ? String(user.role).toUpperCase() : 'USER',
    };
    
    // Atualizar dados do usuário no localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
    
    return normalizedUser;
  } catch (error) {
    // Se o token for inválido ou acesso negado, fazer logout
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      logout();
    }
    throw error;
  }
};

/**
 * Atualiza o perfil do usuário
 * @param {Object} data - Dados para atualizar (name, email)
 * @returns {Promise<Object>}
 */
export const updateProfile = async (data) => {
  try {
    const response = await api.put('/auth/profile', data);
    const { user, accessToken, refreshToken } = response.data;
    
    // Normalizar o role antes de salvar
    const normalizedUser = {
      ...user,
      role: user.role ? String(user.role).toUpperCase() : 'USER',
    };
    
    if (accessToken && refreshToken) {
      saveAuth(accessToken, refreshToken, normalizedUser);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
    }
    
    return {
      ...response.data,
      user: normalizedUser,
    };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw new Error(extrairErroApi(error, 'Erro ao atualizar perfil'));
  }
};

/**
 * Troca a senha do usuário
 * @param {string} currentPassword - Senha atual
 * @param {string} newPassword - Nova senha
 * @returns {Promise<Object>}
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });

    const { accessToken, refreshToken } = response.data;
    if (accessToken && refreshToken) {
      const user = getUser();
      saveAuth(accessToken, refreshToken, user);
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    throw new Error(extrairErroApi(error, 'Erro ao trocar senha'));
  }
};

/**
 * Exclui a conta do usuário
 * @returns {Promise<Object>}
 */
export const deleteAccount = async () => {
  try {
    const response = await api.delete('/auth/account');
    logout();
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(extrairErroApi(error, 'Erro ao excluir conta'));
    }
    throw new Error('Erro ao excluir conta');
  }
};
