# TheMovie App

Aplicação web desenvolvida em React e TypeScript para explorar filmes utilizando a API do The Movie Database (TMDB). Permite autenticação OAuth, navegação por categorias, gerenciamento de favoritos e avaliação de filmes.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tech Stack](#tech-stack)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
  - [Estrutura de Pastas](#estrutura-de-pastas)
  - [Gerenciamento de Estado](#gerenciamento-de-estado)
  - [Roteamento](#roteamento)
  - [Integração com API](#integração-com-api)
  - [Arquitetura de Componentes](#arquitetura-de-componentes)
  - [Estilização](#estilização)
  - [Sistema de Tipos](#sistema-de-tipos)
  - [Autenticação](#autenticação)
  - [Formulários](#formulários)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Como Executar](#como-executar)

---

## Visão Geral

O **TheMovie App** é um cliente web para a API do TMDB que demonstra padrões modernos de desenvolvimento React, incluindo:

- Gerenciamento de estado com Redux Toolkit Query
- Autenticação OAuth 2.0
- Rotas protegidas
- Tema escuro com Material-UI
- TypeScript com tipagem estrita

---

## Funcionalidades

- **Autenticação OAuth** com The Movie Database
- **Navegação por categorias**: Em Cartaz, Mais Votados, Populares, Em Breve
- **Detalhes do filme**: Sinopse, gêneros, duração, avaliação
- **Sistema de favoritos**: Adicionar/remover filmes favoritos
- **Avaliação de filmes**: Escala de 0.5 a 10 estrelas
- **Interface responsiva** com tema escuro

---

## Tech Stack

### Core
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 19.2.0 | Biblioteca de UI |
| TypeScript | 4.9.5 | Tipagem estática |
| React Router DOM | 7.9.5 | Roteamento client-side |

### Estado e Dados
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Redux Toolkit | 2.9.2 | Gerenciamento de estado |
| RTK Query | (incluso) | Cache e fetching de dados |
| React Redux | 9.2.0 | Bindings React para Redux |

### UI e Estilização
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Material-UI | 7.3.4 | Biblioteca de componentes |
| Emotion | 11.14.x | CSS-in-JS |
| MUI Icons | 7.3.4 | Ícones Material Design |

### Formulários e Utilitários
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React Hook Form | 7.66.0 | Gerenciamento de formulários |
| date-fns | 4.1.0 | Formatação de datas |
| Axios | 1.13.1 | Cliente HTTP |

---

**Autenticação (`tmdbAuth.ts`):**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/authentication/token/new` | Criar request token |
| POST | `/authentication/session/new` | Criar sessão |
| DELETE | `/authentication/session` | Encerrar sessão |

**Filmes (`movieApi.ts`):**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/movie/{category}` | Listar por categoria |
| GET | `/movie/{id}` | Detalhes do filme |
| GET | `/movie/{id}/account_states` | Estado (favorito, avaliação) |
| POST | `/movie/{id}/rating` | Avaliar filme |

**Conta (`accountApi.ts`):**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/account` | Dados da conta |
| GET | `/account/{id}/favorite/movies` | Lista de favoritos |
| POST | `/account/{id}/favorite` | Adicionar/remover favorito |

---

#### Interfaces Principais

**Movie:**
```typescript
// src/types/movie.d.ts
interface Movie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  genre_ids: number[]
  original_language: string
}

interface MovieDetails extends Movie {
  runtime: number
  genres: Array<{ id: number; name: string }>
  budget: number
  status: string
  tagline: string
}
```

**Account:**
```typescript
// src/types/account.d.ts
interface AccountDetails {
  id: number
  name: string
  username: string
}

interface FavoriteMoviesResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}
```
---

### Autenticação

#### Fluxo OAuth 2.0 com TMDB

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUXO DE LOGIN                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Usuário clica "Entrar"                                      │
│              ↓                                                  │
│  2. createRequestToken() → request_token                        │
│              ↓                                                  │
│  3. Redirect → TMDB (usuário aprova)                            │
│              ↓                                                  │
│  4. Callback com ?request_token=XXX                             │
│              ↓                                                  │
│  5. createSession(token) → session_id                           │
│              ↓                                                  │
│  6. localStorage.setItem("session_id", session_id)              │
│              ↓                                                  │
│  7. Redirect → /home                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
---

## Configuração do Ambiente

### 1. Criar arquivo `.env`

```bash
cp .env.example .env
```

### 2. Configurar variáveis

```env
REACT_APP_TMDB_API_KEY=sua_api_key_aqui
REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
REACT_APP_TMDB_IMG_URL=https://image.tmdb.org/t/p/w500
```

### 3. Obter API Key do TMDB

1. Crie uma conta em [themoviedb.org](https://www.themoviedb.org/)
2. Acesse Settings → API
3. Solicite uma API Key (gratuita)
4. Copie a chave para o arquivo `.env`

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia servidor de desenvolvimento na porta 3000 |
| `npm run build` | Gera build de produção em `/build` |
| `npm test` | Executa testes com Jest |
| `npm run eject` | Ejeta configurações do Create React App |

---

## Como Executar

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd themovie-app

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com sua API key do TMDB

# 4. Iniciar aplicação
npm start
```

A aplicação estará disponível em `http://localhost:3000`

---

## Licença

Este projeto foi desenvolvido para fins educacionais.
