export function extrairErroApi(err, fallback = 'Ocorreu um erro. Tente novamente.') {
  if (!err?.response) {
    if (err?.code === 'ECONNREFUSED') {
      return 'Não foi possível conectar à API. Verifique se o servidor está acessível.';
    }
    if (err?.code === 'ETIMEDOUT' || err?.code === 'ERR_NETWORK') {
      return 'Erro de conexão. Verifique sua conexão com a internet.';
    }
    if (err?.request) {
      return 'Erro de conexão. Verifique sua conexão com a internet.';
    }
  }

  const data = err?.response?.data;
  if (data?.details && Array.isArray(data.details)) {
    return data.details.map((d) => d.message || d).join(', ');
  }
  return data?.error || data?.message || err?.message || fallback;
}
