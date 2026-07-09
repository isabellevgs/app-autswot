export const AUTH_SESSION_EXPIRED = 'autswot:session-expired';
export const AUTH_SESSION_EXPIRED_KEY = 'autswot:session-expired';
export const QUESTIONARIO_SYNC_KEY = '@autswot-questionario-sync';

export function emitSessionExpired() {
  localStorage.setItem(AUTH_SESSION_EXPIRED_KEY, String(Date.now()));
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED));
}

export function notifyQuestionarioUpdated() {
  localStorage.setItem(QUESTIONARIO_SYNC_KEY, String(Date.now()));
}
