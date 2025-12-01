// Utilitário para verificar a saúde da conexão com a API

/**
 * Verifica se a API está respondendo
 * @returns {Promise<{ok: boolean, message: string}>}
 */
export const checkAPIHealth = async () => {
  try {
    const response = await fetch('http://localhost:3000/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 segundos
    });

    if (response.ok) {
      const data = await response.json();
      return { ok: true, message: 'API está respondendo' };
    }

    return { 
      ok: false, 
      message: `API retornou status ${response.status}` 
    };
  } catch (error) {
    console.error('❌ Erro ao verificar API:', error);
    
    if (error.name === 'TimeoutError') {
      return { 
        ok: false, 
        message: 'A API demorou muito para responder (timeout)' 
      };
    }
    
    if (error.cause?.code === 'ECONNREFUSED') {
      return { 
        ok: false, 
        message: 'Não foi possível conectar à API. Verifique se ela está rodando em http://localhost:3000' 
      };
    }
    
    return { 
      ok: false, 
      message: error.message || 'Erro ao conectar com a API' 
    };
  }
};

/**
 * Exibe uma mensagem de erro de conexão mais detalhada
 * @param {Error} error - O erro ocorrido
 * @returns {string} Mensagem de erro formatada
 */
export const getConnectionErrorMessage = (error) => {
  // Verificar console para mais detalhes
  console.group('🔍 Diagnóstico de Conexão');
  console.log('Erro:', error);
  console.log('Código:', error.code);
  console.log('URL:', error.config?.url);
  console.log('BaseURL:', error.config?.baseURL);
  console.groupEnd();

  if (error.code === 'ECONNREFUSED') {
    return `
      ❌ Não foi possível conectar à API
      
      Verifique se:
      1. A API está rodando: cd api-autswot && bun run dev
      2. A API está na porta 3000: http://localhost:3000
      3. O console do navegador para mais detalhes
    `;
  }

  if (error.code === 'ETIMEDOUT') {
    return `
      ⏱️ A requisição demorou muito para responder
      
      Verifique se:
      1. Sua conexão com a internet está funcionando
      2. A API não está sobrecarregada
      3. Tente novamente em alguns instantes
    `;
  }

  if (error.response) {
    return `
      ❌ Erro da API: ${error.response.status}
      ${error.response.data?.message || error.response.data?.error || ''}
    `;
  }

  return `Erro de conexão: ${error.message}`;
};

