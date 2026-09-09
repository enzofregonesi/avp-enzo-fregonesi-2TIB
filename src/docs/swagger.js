export default {
  openapi: "3.0.3",
  info: {
    title: "API AV2 - Jogos",
    version: "1.0.0",
    description: "API Express com armazenamento em memória, autenticação, CRUD e upload."
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "Token fixo" }
    },
    schemas: {
      Jogo: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nome: { type: "string" },
          genero: { type: "string" }
        }
      }
    }
  },
  paths: {
    "/usuarios": {
      post: {
        summary: "Cadastrar usuário",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["nome", "email", "senha"], properties: { nome: { type: "string" }, email: { type: "string" }, senha: { type: "string", format: "password" } } } } } },
        responses: { 201: { description: "Usuário cadastrado" } }
      }
    },
    "/login": {
      post: {
        summary: "Autenticar usuário",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email", "senha"], properties: { email: { type: "string" }, senha: { type: "string", format: "password" } } } } } },
        responses: { 200: { description: "Token gerado" }, 401: { description: "Credenciais inválidas" } }
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