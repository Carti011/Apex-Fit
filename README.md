# Apex Fit

**Plataforma de Gamificacao Fitness com Nutricionista Digital por IA**

Transforme sua evolucao fisica em uma experiencia de RPG — com XP, Ligas, Streaks e uma IA que negocia a sua dieta.

---

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## Visao Geral

O Apex Fit combina ciencia do comportamento com gamificacao para transformar habitos fitness em progresso tangivel e viciante. O sistema calcula o gasto energetico real do usuario (TMB + GET via Mifflin-St Jeor e Katch-McArdle), gera dietas personalizadas por meio de um Nutricionista Digital com IA (Google Gemini) e recompensa cada acao saudavel com XP, Streaks e evolucao de Liga.

A interface segue uma identidade visual **dark + neon glassmorphism** inspirada em jogos modernos, com foco total em dopamina e retencao.

---

## Funcionalidades

### Autenticacao e Perfil

- Registro e login com autenticacao stateless via **JWT**
- Perfil biologico completo: peso, altura, idade, genero, nivel de atividade e % de gordura corporal (opcional)
- Calculo automatico de TMB e GET com suporte a **Katch-McArdle** quando o BF for informado
- Gestao de restricoes alimentares, aversoes e preferencias para a IA

### Gamificacao

- Sistema de **XP** concedido por acoes validadas (dieta, treino, streak)
- **Ofensiva (Streak):** dias consecutivos ativos — zera se falhar um dia, mas o XP acumulado e preservado
- **Ligas com tiers fixos de XP:**

| Liga     | XP Necessario |
| -------- | ------------- |
| Bronze   | 0 XP          |
| Prata    | 3.000 XP      |
| Ouro     | 10.000 XP     |
| Diamante | 50.000 XP     |

- Historico de XP semanal com visualizacao em grafico de linha
- **Squads:** grupos fechados para competicao entre amigos
- **Academias:** comunidades maiores para ranking institucional

### Nutricionista Digital (IA)

- Chat com streaming em tempo real via **SSE (Server-Sent Events)**
- A IA le o perfil do usuario (GET, objetivo, restricoes) e conduz o onboarding da dieta
- Negociacao iterativa: o usuario pede ajustes e a IA recalcula
- Salvamento da dieta aprovada no banco de dados
- Exportacao do plano nutricional em **PDF** (gerado no frontend via html2pdf.js)

---

## Stack Tecnica

### Backend (`/backend`)

| Camada         | Tecnologia                          |
| -------------- | ----------------------------------- |
| Linguagem      | Java 21                             |
| Framework      | Spring Boot 3.3                     |
| Seguranca      | Spring Security + JWT (jjwt 0.11.5) |
| Persistencia   | Spring Data JPA + Hibernate         |
| Banco de Dados | PostgreSQL 16                       |
| Migracoes      | Flyway                              |
| Testes         | JUnit 5 + Mockito + H2 (in-memory)  |
| Cobertura      | JaCoCo                              |

### Frontend (`/frontend`)

| Camada      | Tecnologia                    |
| ----------- | ----------------------------- |
| Framework   | React 18 + Vite 5             |
| Estilizacao | TailwindCSS 4 + Glassmorphism |
| Roteamento  | React Router DOM 6            |
| Graficos    | Recharts                      |
| Icones      | Lucide React                  |
| PDF         | html2pdf.js                   |
| Testes      | Vitest + Testing Library      |

### Infraestrutura

| Servico     | Tecnologia                          |
| ----------- | ----------------------------------- |
| Banco (dev) | Docker Compose (postgres:16-alpine) |
| Admin DB    | Adminer                             |
| IA          | Google Gemini API                   |

---

## Estrutura do Repositorio

```text
Apex Fit/
├── backend/
│   ├── src/
│   │   ├── main/java/com/apexfit/backend/
│   │   │   ├── config/          # Configuracoes (Security, Flyway)
│   │   │   ├── controller/      # Endpoints REST (Auth, Profile, Gamification, AI)
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── exception/       # Handlers globais de excecao
│   │   │   ├── model/           # Entidades JPA (User, League, Squad, Academy, XpHistory)
│   │   │   ├── repository/      # Interfaces Spring Data JPA
│   │   │   ├── security/        # JWT Filter + UserDetailsService
│   │   │   └── service/         # Regras de negocio (Auth, Profile, Gamification, AI)
│   │   └── resources/
│   │       └── db/migration/    # Scripts Flyway (imutaveis apos aplicados)
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Rodando Localmente

### Pre-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execucao
- [Java 21](https://adoptium.net/) instalado
- [Node.js 18+](https://nodejs.org/) instalado

### 1. Subir a Infraestrutura (Banco de Dados)

```bash
docker-compose up -d
```

Isso inicializa dois servicos:

- **PostgreSQL 16** em `localhost:5432` (banco: `apexfit_db`)
- **Adminer** (GUI do banco) em `http://localhost:8081`

### 2. Configurar Variaveis de Ambiente do Backend

Crie o arquivo `backend/src/main/resources/application-local.properties` (ignorado pelo Git):

```properties
# Conexao com o banco local
spring.datasource.url=jdbc:postgresql://localhost:5432/apexfit_db
spring.datasource.username=apexuser
spring.datasource.password=apexpassword

# Segredo JWT (minimo 256 bits em producao)
jwt.secret=SEU_SEGREDO_JWT_AQUI

# Chave da API do Google Gemini
gemini.api.key=SUA_CHAVE_GEMINI_AQUI
```

### 3. Rodar o Backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

A API estara disponivel em `http://localhost:8080`. As migracoes Flyway sao aplicadas automaticamente no startup.

### 4. Rodar o Frontend

Em um novo terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicacao estara disponivel em `http://localhost:5173`.

---

## Endpoints Principais da API

| Metodo | Endpoint                      | Descricao                                             | Auth |
| ------ | ----------------------------- | ----------------------------------------------------- | ---- |
| `POST` | `/api/auth/register`          | Registro de novo usuario                              | Nao  |
| `POST` | `/api/auth/login`             | Login, retorna JWT                                    | Nao  |
| `GET`  | `/api/profile/me`             | Dados do perfil autenticado                           | Sim  |
| `PUT`  | `/api/profile/bio`            | Atualiza perfil biologico                             | Sim  |
| `GET`  | `/api/gamification/dashboard` | XP, liga, streak e historico                          | Sim  |
| `POST` | `/api/ai/chat`                | Mensagem para o Nutricionista Digital (streaming SSE) | Sim  |
| `POST` | `/api/ai/save-diet`           | Salva a dieta gerada pela IA                          | Sim  |
| `GET`  | `/api/status`                 | Health check da API                                   | Nao  |

> Todas as rotas autenticadas exigem o header `Authorization: Bearer <token>`.

---

## Testes

### Backend

```bash
cd backend
./mvnw test
```

Gera relatorio de cobertura JaCoCo em `backend/target/site/jacoco/index.html`.

### Frontend

```bash
cd frontend
npm test              # Executa uma vez
npm run test:watch    # Modo watch
npm run test:coverage # Com relatorio de cobertura
```

---

## Deploy (Producao)

### Banco de Dados — Neon (Serverless PostgreSQL)

1. Crie um projeto em [neon.tech](https://neon.tech)
2. Obtenha a Connection String no formato `postgres://user:pass@host/db?sslmode=require`
3. Converta para JDBC: `jdbc:postgresql://host/db?sslmode=require`

### Frontend — Vercel

| Configuracao     | Valor           |
| ---------------- | --------------- |
| Root Directory   | `frontend`      |
| Framework Preset | Vite            |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |

### Backend — Render ou Railway

| Variavel de Ambiente | Descricao                     |
| -------------------- | ----------------------------- |
| `DB_URL`             | JDBC URL do banco em producao |
| `DB_USERNAME`        | Usuario do banco              |
| `DB_PASSWORD`        | Senha do banco                |
| `JWT_SECRET`         | Segredo JWT (minimo 256 bits) |
| `GEMINI_API_KEY`     | Chave da API do Google Gemini |

O backend e empacotado como JAR via `./mvnw package` e executado diretamente. Alternativamente, utilize o Dockerfile caso o servico de hospedagem suporte containers.

---

## Convencoes de Desenvolvimento

### Branches

| Prefixo           | Uso                                                           |
| ----------------- | ------------------------------------------------------------- |
| `develop`         | Branch de staging (trabalho continuo)                         |
| `main`            | Producao — merge realizado apenas pelo responsavel do projeto |
| `feat/<nome>`     | Novas funcionalidades                                         |
| `fix/<nome>`      | Correcao de bugs                                              |
| `refactor/<nome>` | Refatoracoes sem mudanca de comportamento                     |

---

### Migracoes Flyway

Arquivos em `backend/src/main/resources/db/migration/` sao **imutaveis** apos aplicados em qualquer ambiente. Qualquer alteracao de schema deve ser feita em um **novo arquivo** com a proxima versao (ex: `V10__descricao.sql`).

---

## Contribuindo

1. Crie uma branch a partir de `develop`: `git checkout -b feat/minha-feature`
2. Implemente a mudanca seguindo as convencoes acima
3. Certifique-se de que todos os testes passam: `./mvnw test` e `npm test`
4. Abra um Pull Request para `develop` com descricao clara do que foi feito
