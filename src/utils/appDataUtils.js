import api from '../services/api';
import { extrairErroApi } from './api-errors';

export async function buscarTcle() {
  try {
    const res = await api.get('/app-data/tcle');
    return { tcle: res.data.tcle, erro: null };
  } catch (err) {
    return {
      tcle: null,
      erro: extrairErroApi(err, 'Erro ao carregar o termo de consentimento.'),
    };
  }
}

export async function atualizarTcle(tcle) {
  try {
    const res = await api.put('/app-data/tcle', { tcle });
    return { tcle: res.data.tcle, erro: null };
  } catch (err) {
    return {
      tcle: null,
      erro: extrairErroApi(err, 'Erro ao salvar o termo de consentimento.'),
    };
  }
}
export async function buscarAcessoLiberado() {
  try {
    const res = await api.get('/app-data/acesso-liberado');
    return { acessoLiberado: res.data.acessoLiberado, erro: null };
  } catch (err) {
    return {
      acessoLiberado: null,
      erro: extrairErroApi(err, 'Erro ao verificar liberação de acesso.'),
    };
  }
}

export async function buscarTermoUso() {
  try {
    const res = await api.get('/app-data/termoUso');
    return { termoUso: res.data.termoUso, erro: null };
  } catch (err) {
    return {
      termoUso: null,
      erro: extrairErroApi(err, 'Erro ao carregar o termo de uso.'),
    };
  }
}
