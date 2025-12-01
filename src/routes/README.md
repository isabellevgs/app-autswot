# Sistema de Rotas Protegidas - AutSWOT

Este diretório contém a configuração de rotas da aplicação, implementando autenticação com JWT e rotas protegidas seguindo as melhores práticas do React Router DOM v7.

## 📁 Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.jsx          # Contexto global de autenticação
├── services/
│   ├── authService.js           # Gerenciamento do token JWT
│   └── api.js                   # Configuração do Axios com interceptors
├── routes/
│   ├── PrivateRoute.jsx         # Componente de rota protegida
│   ├── AppRoutes.jsx            # Configuração de todas as rotas
│   └── README.md                # Este arquivo
└── App.jsx                      # Ponto de entrada principal
```

## 🔐 Como Funciona

### 1. **AuthContext** (`contexts/AuthContext.jsx`)

Gerencia o estado de autenticação globalmente usando React Context API:

- **`user`**: Dados do usuário logado
- **`login(email, password)`**: Função de login que retorna um token JWT
- **`logout()`**: Remove o token e desloga o usuário
- **`signed`**: Boolean que indica se o usuário está autenticado
- **`loading`**: Boolean para controlar o estado de carregamento

### 2. **authService** (`services/authService.js`)

Gerencia o token JWT no `localStorage`:

- **`login(token)`**: Salva o token no localStorage
- **`logout()`**: Remove o token do localStorage
- **`getToken()`**: Retorna o token armazenado
- **`isAuthenticated()`**: Verifica se existe um token

### 3. **API** (`services/api.js`)

Instância configurada do Axios com interceptor automático:

- Adiciona o token JWT em todas as requisições no header `Authorization`
- Configura a URL base da API

### 4. **PrivateRoute** (`routes/PrivateRoute.jsx`)

Componente que protege rotas privadas:

```jsx
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

- Verifica se o usuário está autenticado
- Redireciona para `/login` se não estiver autenticado
- Mostra loading enquanto verifica a autenticação

### 5. **AppRoutes** (`routes/AppRoutes.jsx`)

Configuração centralizada de todas as rotas:

- **Rotas públicas**: Login, Cadastro
- **Rotas protegidas**: Home, Perfil, Questionário, Diário, etc.

## 🚀 Fluxo de Autenticação

1. **Acesso inicial**: Usuário tenta acessar uma rota protegida
2. **Verificação**: `PrivateRoute` verifica se há token no `localStorage`
3. **Redirecionamento**: Se não houver token, redireciona para `/login`
4. **Login**: Usuário faz login e recebe um token JWT
5. **Armazenamento**: Token é salvo no `localStorage` via `authService`
6. **Acesso liberado**: Usuário pode acessar rotas protegidas
7. **Requisições**: Todas as requisições HTTP incluem o token automaticamente

## 📝 Exemplo de Uso

### Adicionar uma nova rota protegida:

```jsx
// Em AppRoutes.jsx
<Route
  path="/nova-rota"
  element={
    <PrivateRoute>
      <NovaPage />
    </PrivateRoute>
  }
/>
```

### Usar autenticação em um componente:

```jsx
import { useAuth } from '../contexts/AuthContext';

function MeuComponente() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Olá, {user?.name}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Fazer uma requisição autenticada:

```jsx
import api from '../services/api';

// O token é adicionado automaticamente
const response = await api.get('/usuarios/perfil');
```

## 🔒 Segurança

- ✅ Token JWT armazenado no `localStorage`
- ✅ Verificação automática de autenticação em rotas protegidas
- ✅ Redirecionamento automático para login se não autenticado
- ✅ Token enviado automaticamente em todas as requisições
- ✅ Usuários logados não podem acessar páginas de login/cadastro

## 🎯 Próximos Passos

Para ambiente de produção, considere:

1. **Refresh Token**: Implementar renovação automática de tokens expirados
2. **HttpOnly Cookies**: Usar cookies em vez de `localStorage` para maior segurança
3. **Validação do Token**: Validar o token no back-end em cada requisição
4. **Níveis de Permissão**: Implementar diferentes níveis de acesso (admin, user, etc.)
5. **Persistência de Dados**: Salvar dados do usuário completos, não apenas o nome

## 📚 Referências

- [Artigo da Rocketseat sobre Rotas Protegidas](https://www.rocketseat.com.br/blog/artigos/post/rotas-protegidas-react-router-jwt)
- [React Router DOM v7 Docs](https://reactrouter.com/)
- [JWT.io](https://jwt.io/)

