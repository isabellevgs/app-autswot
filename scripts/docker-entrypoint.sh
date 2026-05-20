#!/bin/sh
# Verifica conectividade com a API antes de iniciar o nginx.
# Usa wget com timeout curto (getent trava quando DNS falha).
# Logs vão para stdout — visíveis no Coolify após deploy.
# Sempre inicia o nginx, mesmo se a API estiver indisponível.

SERVICE="${AUTSWOT_SERVICE:-autswot-app}"
API_HOST="${API_UPSTREAM_HOST:-autswot-api}"
API_PORT="${API_UPSTREAM_PORT:-3000}"
MAX_ATTEMPTS="${API_CHECK_RETRIES:-5}"
RETRY_DELAY="${API_CHECK_DELAY:-3}"

log() {
  echo "[${SERVICE} deploy-check $(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"
}

log "========== Verificação pós-deploy =========="
log "Container: $(hostname)"
log "API upstream: http://${API_HOST}:${API_PORT}"

api_ok=0
attempt=1

while [ "${attempt}" -le "${MAX_ATTEMPTS}" ]; do
  log "Tentativa ${attempt}/${MAX_ATTEMPTS}: GET http://${API_HOST}:${API_PORT}/health ..."

  if wget -qO- --timeout=3 --tries=1 \
    "http://${API_HOST}:${API_PORT}/health" \
    >/tmp/autswot-health.out 2>/tmp/autswot-health.err; then
    log "API: OK → $(tr -d '\n' </tmp/autswot-health.out)"
    api_ok=1
    break
  fi

  err=$(tr -d '\n' </tmp/autswot-health.err 2>/dev/null | head -c 200)
  log "API: falhou → ${err:-sem detalhe}"
  attempt=$((attempt + 1))
  [ "${attempt}" -le "${MAX_ATTEMPTS}" ] && sleep "${RETRY_DELAY}"
done

if [ "${api_ok}" -eq 0 ]; then
  log "API: FALHOU após ${MAX_ATTEMPTS} tentativas"
  log "Causa provável: app e API não estão na mesma rede Docker"
  log "Correção na VPS:"
  log "  docker network create coolify 2>/dev/null || true"
  log "  docker network connect --alias autswot-api coolify <container-api>"
  log "  docker network connect coolify <container-app>"
  log "Proxy /api/* retornará 502 até corrigir a rede"
else
  log "Verificação concluída com sucesso"
fi

log "========== Iniciando nginx =========="
exec nginx -g "daemon off;"
