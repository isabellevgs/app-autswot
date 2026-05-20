#!/bin/sh
# Verifica conectividade com a API antes de iniciar o nginx.
# Logs vão para stdout — visíveis no Coolify após deploy.
set -e

SERVICE="${AUTSWOT_SERVICE:-autswot-app}"
API_HOST="${API_UPSTREAM_HOST:-autswot-api}"
API_PORT="${API_UPSTREAM_PORT:-3000}"
MAX_ATTEMPTS="${API_CHECK_RETRIES:-5}"
RETRY_DELAY="${API_CHECK_DELAY:-3}"

log() {
  echo "[${SERVICE} deploy-check $(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"
}

check_dns() {
  if getent hosts "${API_HOST}" >/dev/null 2>&1; then
    log "DNS ${API_HOST}: OK → $(getent hosts "${API_HOST}" | awk '{print $1}' | head -1)"
    return 0
  fi
  return 1
}

check_http() {
  if wget -qO- --timeout=5 "http://${API_HOST}:${API_PORT}/health" 2>/tmp/autswot-health.out; then
    log "HTTP http://${API_HOST}:${API_PORT}/health: OK → $(tr -d '\n' </tmp/autswot-health.out)"
    return 0
  fi
  return 1
}

log "========== Verificação pós-deploy =========="
log "Container: $(hostname)"
log "API upstream: http://${API_HOST}:${API_PORT}"

dns_ok=0
attempt=1
while [ "${attempt}" -le "${MAX_ATTEMPTS}" ]; do
  if check_dns; then
    dns_ok=1
    break
  fi
  log "DNS ${API_HOST}: tentativa ${attempt}/${MAX_ATTEMPTS} falhou — aguardando ${RETRY_DELAY}s"
  attempt=$((attempt + 1))
  sleep "${RETRY_DELAY}"
done

if [ "${dns_ok}" -eq 0 ]; then
  log "DNS ${API_HOST}: FALHOU após ${MAX_ATTEMPTS} tentativas"
  log "Ação: conecte app e API na rede coolify com alias autswot-api"
  log "  docker network create coolify 2>/dev/null || true"
  log "  docker network connect --alias autswot-api coolify <container-api>"
  log "  docker network connect coolify <container-app>"
  log "Proxy /api/* retornará 502 até a rede ser corrigida"
else
  http_ok=0
  attempt=1
  while [ "${attempt}" -le "${MAX_ATTEMPTS}" ]; do
    if check_http; then
      http_ok=1
      break
    fi
    log "HTTP /health: tentativa ${attempt}/${MAX_ATTEMPTS} falhou — aguardando ${RETRY_DELAY}s"
    attempt=$((attempt + 1))
    sleep "${RETRY_DELAY}"
  done

  if [ "${http_ok}" -eq 0 ]; then
    log "HTTP /health: FALHOU — DNS ok, mas API não responde na porta ${API_PORT}"
    log "Verifique: docker logs autswot-api --tail 50"
  fi
fi

log "========== Iniciando nginx =========="
exec nginx -g "daemon off;"
