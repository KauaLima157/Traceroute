# Traceroute Backend

Este é o backend do projeto Traceroute, uma aplicação para execução e gerenciamento de traceroutes de rede. Ele oferece uma API REST robusta para iniciar traceroutes, consultar histórico e visualizar estatísticas.

## 🚀 Tecnologias

O projeto utiliza as seguintes tecnologias:

- **Node.js**: Ambiente de execução JavaScript.
- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Express**: Framework web para Node.js.
- **PostgreSQL**: Banco de dados relacional.
- **Socket.io**: Comunicação em tempo real (instalado).
- **Swagger**: Documentação da API.
- **Docker** (Opcional, mas recomendado para o banco de dados).

## 📂 Estrutura do Projeto

A estrutura de pastas em `src/` segue uma arquitetura limpa e modular:

- **config/**: Arquivos de configuração (Banco de dados, Swagger, etc.).
- **controllers/**: Controladores que lidam com as requisições HTTP.
- **core/**: Contém a lógica de negócio central (Use Cases, Entidades).
- **database/**: Scripts de criação e migração do banco de dados.
- **middlewares/**: Middlewares do Express (Autenticação, tratamento de erros, etc.).
- **repositories/**: Camada de acesso a dados (interação com o banco de dados).
- **routes/**: Definição das rotas da API.
- **services/**: Serviços externos ou internos (DNS, Geolocalização, Execução do Traceroute).
- **utils/**: Funções utilitárias (Logger, formatadores).
- **validators/**: Validações de dados (provavelmente schemas Zod).

Arquivo principal:
- **server.ts**: Ponto de entrada da aplicação, onde o servidor é configurado e iniciado.

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (v18 ou superior recomendado)
- PostgreSQL

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (ajuste conforme seu ambiente):

   ```env
   # Configuração do Servidor
   PORT=3000
   NODE_ENV=development # ou production
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   LOG_LEVEL=info

   # Configuração do Banco de Dados
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   DB_NAME=traceroutes
   DB_PORT=5432
   ```

4. **Inicie o Banco de Dados:**
   Certifique-se de que o PostgreSQL está rodando e que as credenciais no `.env` estão corretas. A aplicação tentará criar o banco de dados e rodar as migrações automaticamente ao iniciar.

5. **Execute a aplicação:**
   Para desenvolvimento:
   ```bash
   npm run dev
   ```

## 📖 Documentação da API

A documentação interativa da API (Swagger UI) está disponível em:

```
http://localhost:3000/api-docs
```

Lá você pode testar todos os endpoints diretamente pelo navegador.

### Principais Rotas

Abaixo estão as rotas disponíveis na API (`/api/traceroute`):

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/` | Inicia um novo traceroute. Requer JSON com `target` (IP/Host). |
| `GET` | `/history` | Retorna o histórico de traceroutes do usuário (paginado). |
| `GET` | `/stats` | Retorna estatísticas de uso do usuário. |
| `GET` | `/:id` | Retorna os detalhes de um traceroute específico pelo ID. |
| `DELETE` | `/:id` | Remove um traceroute pelo ID. |

## 🧪 Uso

Para iniciar um traceroute, faça uma requisição POST para `/api/traceroute` com o seguinte corpo:

```json
{
  "target": "google.com",
  "maxHops": 30,
  "timeout": 5000
}
```

A resposta conterá o ID do traceroute e o status inicial "processing". O processamento ocorre em segundo plano.

## 🤝 Contribuição

Sinta-se à vontade para abrir issues e pull requests para melhorias e correções.
