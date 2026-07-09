import api from '../services/api';
import { fetchPerguntas } from './fetchPerguntas';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../services/authService';
import { QUESTIONARIO_SYNC_KEY } from './auth-events';

const CACHE_TTL_MS = 60_000;

let perguntasEntry = { data: null, expiresAt: 0 };
let perguntasInflight = null;

let respostasEntry = { data: null, expiresAt: 0, key: '' };
const respostasInflightMap = new Map();

let storageListenerAttached = false;

function attachStorageListener() {
  if (storageListenerAttached || typeof window === 'undefined') return;
  storageListenerAttached = true;

  window.addEventListener('storage', (event) => {
    if (
      event.key === ACCESS_TOKEN_KEY ||
      event.key === REFRESH_TOKEN_KEY ||
      event.key === USER_KEY ||
      event.key === QUESTIONARIO_SYNC_KEY ||
      event.key === null
    ) {
      invalidateQuestionarioCache();
    }
  });
}

function cacheValid(entry) {
  return entry.data !== null && entry.expiresAt > Date.now();
}

export function invalidatePerguntasCache() {
  perguntasEntry = { data: null, expiresAt: 0 };
  perguntasInflight = null;
}

export function invalidateRespostasCache() {
  respostasEntry = { data: null, expiresAt: 0, key: '' };
  respostasInflightMap.clear();
}

export function invalidateQuestionarioCache() {
  invalidatePerguntasCache();
  invalidateRespostasCache();
}

/**
 * Retorna perguntas com cache em memória e deduplicação de requisições em voo.
 */
export async function fetchPerguntasCached({ force = false } = {}) {
  attachStorageListener();

  if (!force && cacheValid(perguntasEntry)) {
    return perguntasEntry.data;
  }

  if (!force && perguntasInflight) {
    return perguntasInflight;
  }

  perguntasInflight = fetchPerguntas()
    .then((data) => {
      perguntasEntry = { data, expiresAt: Date.now() + CACHE_TTL_MS };
      perguntasInflight = null;
      return data;
    })
    .catch((err) => {
      perguntasInflight = null;
      throw err;
    });

  return perguntasInflight;
}

function mapRespostasResponse(response) {
  const respostasMap = {};
  (response.data?.respostas ?? []).forEach((resposta) => {
    const key = `${resposta.tipo}-${resposta.perguntaId}`;
    respostasMap[key] = resposta;
  });
  return respostasMap;
}

/**
 * Retorna respostas salvas com cache em memória e deduplicação de requisições em voo.
 */
export async function fetchRespostasCached({ tipo, force = false } = {}) {
  attachStorageListener();

  const cacheKey = tipo || 'all';

  if (!force && respostasEntry.key === cacheKey && cacheValid(respostasEntry)) {
    return respostasEntry.data;
  }

  const inflight = respostasInflightMap.get(cacheKey);
  if (!force && inflight) {
    return inflight;
  }

  const params = tipo ? { tipo } : {};

  const promise = api
    .get('/questionario-resposta', { params })
    .then((response) => {
      const data = mapRespostasResponse(response);
      respostasEntry = { data, expiresAt: Date.now() + CACHE_TTL_MS, key: cacheKey };
      respostasInflightMap.delete(cacheKey);
      return data;
    })
    .catch((err) => {
      respostasInflightMap.delete(cacheKey);
      throw err;
    });

  respostasInflightMap.set(cacheKey, promise);
  return promise;
}
