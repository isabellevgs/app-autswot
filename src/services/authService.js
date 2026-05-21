// Gerenciamento de autenticação e tokens JWT
import api from './api';

const apiUrl = () => api.defaults.baseURL ?? import.meta.env.VITE_API_URL ?? '';

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
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Remove os tokens e dados do usuário (logout)
export const logout = () => {
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
    
    if (error.response) {
      if (error.response.status === 429) {
        throw new Error('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      }
      // Erro da API
      const errorMsg = error.response.data?.error || error.response.data?.message || 'Erro ao fazer login';
      throw new Error(errorMsg);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Não foi possível conectar à API. Verifique se o servidor está acessível');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('A requisição demorou muito. Verifique sua conexão com a internet.');
    } else if (error.request) {
      // Erro de rede
      throw new Error('Erro de conexão. Verifique sua conexão com a internet');
    } else {
      // Outro erro
      throw new Error(error.message || 'Erro ao fazer login');
    }
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
    
    if (error.response) {
      // Erro da API
      const errorMsg = error.response.data?.error || error.response.data?.message || 'Erro ao criar conta';
      const details = error.response.data?.details;
      
      if (details && Array.isArray(details)) {
        // Formatar erros de validação do Zod
        const messages = details.map(d => d.message || `${d.field}: erro`).join(', ');
        throw new Error(messages);
      }
      
      throw new Error(errorMsg);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Não foi possível conectar à API. Verifique se o servidor está acessível');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('A requisição demorou muito. Verifique sua conexão com a internet.');
    } else if (error.request) {
      // Erro de rede
      throw new Error('Erro de conexão. Verifique sua conexão com a internet');
    } else {
      // Outro erro
      throw new Error(error.message || 'Erro ao criar conta');
    }
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
    // Se o token for inválido, fazer logout
    if (error.response && error.response.status === 401) {
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
    const { user } = response.data;
    
    // Normalizar o role antes de salvar
    const normalizedUser = {
      ...user,
      role: user.role ? String(user.role).toUpperCase() : 'USER',
    };
    
    // Atualizar dados do usuário no localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
    
    return {
      ...response.data,
      user: normalizedUser,
    };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    
    if (error.response) {
      const errorMsg = error.response.data?.error || error.response.data?.message || 'Erro ao atualizar perfil';
      throw new Error(errorMsg);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Não foi possível conectar à API. Verifique se o servidor está acessível');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('A requisição demorou muito. Verifique sua conexão com a internet.');
    } else if (error.request) {
      throw new Error('Erro de conexão. Verifique sua conexão com a internet');
    }
    throw new Error(error.message || 'Erro ao atualizar perfil');
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
    
    const response = await api.put('/v1/auth/change-password', {
      currentPassword,
      newPassword,
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro na API changePassword:', error);
    
    console.error('Erro ao trocar senha:', error);
    
    if (error.response) {
      // A API pode retornar o erro em diferentes formatos
      const errorMsg = error.response.data?.message || 
                      error.response.data?.error || 
                      error.response.data?.message?.error ||
                      'Erro ao trocar senha';
      throw new Error(errorMsg);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Não foi possível conectar à API. Verifique se o servidor está acessível');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('A requisição demorou muito. Verifique sua conexão com a internet.');
    } else if (error.request) {
      throw new Error('Erro de conexão. Verifique sua conexão com a internet');
    }
    throw new Error(error.message || 'Erro ao trocar senha');
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
      const errorMsg = error.response.data.error || 'Erro ao excluir conta';
      throw new Error(errorMsg);
    }
    throw new Error('Erro ao excluir conta');
  }
};
