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
