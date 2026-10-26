export default {
  openapi: "3.0.3",
  info: {
    title: "API AV2 - Jogos",
    version: "1.0.0",
    description: "API de jogos com persistência MySQL via Prisma e autenticação JWT."
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      Jogo: {
        type: "object",
        required: ["nome", "genero"],
        properties: {
          id: { type: "integer" },
          nome: { type: "string" },
          genero: { type: "string" }
        }
      },
      UsuarioCadastro: {
        type: "object",
        required: ["nome", "email", "senha"],
        properties: {
          nome: { type: "string", minLength: 2, maxLength: 100 },
          email: { type: "string", format: "email" },
          senha: { type: "string", minLength: 6, maxLength: 72, format: "password" }
        }
      },
      Credenciais: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: { type: "string", format: "email" },
          senha: { type: "string", format: "password" }
        }
      }
    }
  },
  paths: {
    "/usuarios": {
      post: {
        summary: "Cadastrar usuário",
        requestBody: { required: true, content: { "application/json": { schema: { "$ref": "#/components/schemas/UsuarioCadastro" } } } },
        responses: { 201: { description: "Usuário cadastrado" }, 400: { description: "Dados inválidos" }, 409: { description: "E-mail já cadastrado" } }
      }
    },
    "/login": {
      post: {
        summary: "Autenticar usuário",
        requestBody: { required: true, content: { "application/json": { schema: { "$ref": "#/components/schemas/Credenciais" } } } },
        responses: { 200: { description: "JWT gerado" }, 401: { description: "Credenciais inválidas" } }
      }
    },
    "/upload": {
      post: {
        summary: "Enviar imagem",
        requestBody: { required: true, content: { "multipart/form-data": { schema: { type: "object", properties: { imagem: { type: "string", format: "binary" } } } } } },
        responses: { 201: { description: "Imagem salva" }, 400: { description: "Arquivo inválido" } }
      }
    },
    "/jogos": {
      get: { summary: "Listar jogos", security: [{ bearerAuth: [] }], responses: { 200: { description: "Lista de jogos" } } },
      post: { summary: "Cadastrar jogo", security: [{ bearerAuth: [] }], requestBody: { content: { "application/json": { schema: { "$ref": "#/components/schemas/Jogo" } } } }, responses: { 201: { description: "Jogo criado" } } }
    },
    "/jogos/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      get: { summary: "Buscar jogo", security: [{ bearerAuth: [] }], responses: { 200: { description: "Jogo encontrado" }, 404: { description: "Não encontrado" } } },
      put: { summary: "Atualizar jogo", security: [{ bearerAuth: [] }], requestBody: { content: { "application/json": { schema: { "$ref": "#/components/schemas/Jogo" } } } }, responses: { 200: { description: "Jogo atualizado" } } },
      delete: { summary: "Excluir jogo", security: [{ bearerAuth: [] }], responses: { 200: { description: "Jogo removido" } } }
    }
  }
};