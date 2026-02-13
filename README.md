# Apex Fit - Plataforma de Gamificação Fitness

Bem-vindo ao repositório oficial do **Apex Fit**. Este projeto é uma aplicação Fullstack focada em saúde, nutrição e gamificação do progresso físico.

## 🚀 Tecnologias

O projeto orquestrado em um Monorepo utilizando as seguintes tecnologias:

### Backend (`/backend`)
- **Java 17+**
- **Spring Boot 3**
- **Spring Data JPA** (Persistência)
- **PostgreSQL** (Banco de Dados)
- **Docker** (Ambiente de Desenvolvimento)

### Frontend (`/frontend`)
- **React** (Biblioteca de UI)
- **Vite** (Build Tool)
- **TailwindCSS** (Estilização)

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Docker Desktop instalado e rodando.
- Java 17 instalado.
- Node.js instalado.

### Passo 1: Iniciar o Banco de Dados
Na raiz do projeto, execute:
```bash
docker-compose up -d
```
Isso iniciará o PostgreSQL na porta `5432`.

### Passo 2: Rodar o Backend
```bash
cd backend
./mvnw spring-boot:run
```
O servidor iniciará em `http://localhost:8080`.

### Passo 3: Rodar o Frontend
Em outro terminal:
```bash
cd frontend
npm install # (apenas na primeira vez)
npm run dev
```
Acesse a aplicação em `http://localhost:5173`.

## 🛠️ Scripts Úteis (Automação)

Para facilitar o desenvolvimento, este projeto conta com scripts de automação na raiz. Certifique-se de ter o Node.js instalado.

```bash
# Inicia TODO o ambiente (Docker + Backend + Frontend)
npm run dev

# Para apenas os serviços (Banco de Dados)
npm run services:up
npm run services:stop
```

## 🚀 Guia de Deploy (Produção)

### 1. Banco de Dados
Recomendado: **PostgreSQL 16**.
- **Serviço Sugerido:** Neon (Serverless).
- **Configuração:** Obtenha a Connection String (ex: `postgres://...`) para uso nas variáveis de ambiente.

### 2. Frontend (Vercel)
O projeto frontend está localizado na pasta `/frontend`.
- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3. Backend (Render / Railway)
O backend é uma aplicação Java/Spring Boot containerizada via Docker.
- **Root Directory:** `backend`
- **Environment Variables Necessárias:**
  - `DB_URL`: JDBC URL do banco (ex: `jdbc:postgresql://host:port/db?sslmode=require`)
  - `DB_USERNAME`: Usuário do banco
  - `DB_PASSWORD`: Senha do banco

## 📂 Estrutura de Pastas

```
Apex Fit/
├── backend/          # API RESTful em Java
├── frontend/         # Aplicação React
├── docker-compose.yml # Configuração do Banco de Dados
└── README.md         # Documentação
```

## 🤝 Contribuição
Este projeto segue o padrão de commits semânticos e organização rigorosa de branches.
