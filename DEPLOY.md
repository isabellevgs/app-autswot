# 🚀 Guia de Deploy com Docker

## Pré-requisitos

- Docker e Docker Compose instalados na VPS
- Bun instalado localmente (para desenvolvimento)

## 📦 Build Local

```bash
# Build da imagem
docker build -t autswot-app .

# Testar localmente
docker run -p 80:80 autswot-app
```

## 🌐 Deploy na VPS

### 1. Configurar variáveis de ambiente

Edite o arquivo `.env.production` com as URLs corretas da sua API:

```env
VITE_API_URL=https://api.seudominio.com
```

### 2. Fazer build com variáveis de produção

```bash
# Carregar variáveis de produção no build
docker build --build-arg VITE_API_URL=https://api.seudominio.com -t autswot-app .
```

### 3. Subir com Docker Compose

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Rebuild e restart
docker-compose up -d --build
```

## 🔄 Deploy Manual na VPS

### Opção 1: Build local + Push

```bash
# 1. Build local
docker build -t autswot-app .

# 2. Salvar imagem
docker save autswot-app | gzip > autswot-app.tar.gz

# 3. Enviar para VPS
scp autswot-app.tar.gz user@sua-vps:/home/user/

# 4. Na VPS, carregar imagem
docker load < autswot-app.tar.gz

# 5. Rodar container
docker run -d -p 80:80 --name autswot-app autswot-app
```

### Opção 2: Build direto na VPS

```bash
# 1. Clonar/copiar código para VPS
git clone seu-repo.git
cd seu-repo

# 2. Build
docker build -t autswot-app .

# 3. Rodar
docker run -d -p 80:80 --name autswot-app autswot-app
```

## 🔧 Comandos Úteis

```bash
# Ver containers rodando
docker ps

# Ver logs
docker logs -f autswot-app

# Entrar no container
docker exec -it autswot-app sh

# Restart
docker restart autswot-app

# Remover container
docker rm -f autswot-app

# Limpar imagens antigas
docker image prune -a
```

## 🌍 Nginx Reverse Proxy (Recomendado)

Se você tiver outros serviços na VPS, use nginx como proxy:

```nginx
# /etc/nginx/sites-available/autswot
server {
    listen 80;
    server_name seudominio.com;

    location / {
        proxy_pass http://localhost:3001;  # Porta do container
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Então rode o container em outra porta:

```bash
docker run -d -p 3001:80 --name autswot-app autswot-app
```

## 🔒 SSL com Let's Encrypt

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seudominio.com
```

## 📊 Monitoramento

```bash
# CPU e memória
docker stats autswot-app

# Health check
docker inspect --format='{{.State.Health.Status}}' autswot-app
```

## 🔄 Atualização (CI/CD)

### Script de deploy simples

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando deploy..."

# Pull do código
git pull origin main

# Build nova imagem
docker build -t autswot-app:latest .

# Parar container antigo
docker stop autswot-app
docker rm autswot-app

# Rodar novo container
docker run -d -p 80:80 --name autswot-app autswot-app:latest

# Limpar imagens antigas
docker image prune -f

echo "✅ Deploy concluído!"
```

## 🐛 Troubleshooting

### Container não inicia

```bash
docker logs autswot-app
```

### Porta já em uso

```bash
# Verificar o que está usando a porta
sudo lsof -i :80

# Matar processo
sudo kill -9 PID
```

### Rebuild do zero

```bash
docker-compose down
docker system prune -a
docker-compose up -d --build
```
