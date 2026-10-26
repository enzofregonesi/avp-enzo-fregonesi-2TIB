# API de jogos

Backend em Node.js, Express e Prisma com persistência em MySQL, cadastro de usuários, autenticação JWT e CRUD de jogos.

## Requisitos

- Node.js 20 ou superior e npm
- MySQL ativo
- Um banco criado no MySQL (por exemplo, `jogos_db`)

## Configuração

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env`.
3. Edite `.env` com a URL do seu MySQL no formato `mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO`.
4. Defina `JWT_SECRET` como uma chave aleatória com pelo menos 32 caracteres. Não compartilhe nem envie o arquivo `.env` ao repositório.
5. Crie/aplique as tabelas e gere o cliente Prisma com `npm run db:migrate`. A migration criará as tabelas `jogos` e `usuarios`.
6. Inicie a API com `npm run dev` (desenvolvimento) ou `npm start`.

A API estará disponível em `http://localhost:3000`. Swagger: `http://localhost:3000/api-docs`.

## Testes no Insomnia

Todos os corpos abaixo devem usar **JSON**. Cadastre-se antes de efetuar login; contas e jogos ficam salvos no banco.

### 1. Cadastrar usuário

`POST /usuarios`

```json
{
  "nome": "Enzo",
  "email": "enzo@exemplo.com",
  "senha": "senha123"
}
```

Esperado: `201 Created`. E-mail repetido retorna `409`; campos inválidos retornam `400`.

### 2. Login e token

`POST /login`

```json
{
  "email": "enzo@exemplo.com",
  "senha": "senha123"
}
```

Copie `token` da resposta. No Insomnia, configure **Auth → Bearer Token** nas próximas requisições e cole somente o token. O token expira em uma hora; faça login novamente para obter outro. Sem token ou com token inválido, a API responde `401`.

### 3. CRUD protegido de jogos

Use o token em todas as chamadas:

- `GET /jogos` — listar.
- `GET /jogos/1` — buscar pelo ID.
- `POST /jogos` — cadastrar, com JSON `{"nome":"Hades II","genero":"Ação"}`.
- `PUT /jogos/1` — atualizar campos, por exemplo `{"genero":"Aventura"}`.
- `DELETE /jogos/1` — excluir.

As alterações do CRUD são protegidas por JWT. IDs inválidos retornam `400`; registros inexistentes retornam `404`. Os jogos e usuários permanecem disponíveis após reiniciar a aplicação, pois são persistidos no MySQL.

## Estrutura MVC

- `src/routes`: declaração de endpoints e middlewares.
- `src/controllers`: validação da requisição e respostas HTTP.
- `src/models`: consultas Prisma para jogos e usuários.
- `prisma/schema.prisma` e `prisma/migrations`: modelos e histórico do banco.
- `src/middlewares`: autenticação JWT e upload.
