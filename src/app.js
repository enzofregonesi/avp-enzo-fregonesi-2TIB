import express from "express";
import path from "node:path";
import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import authRoutes from "./routes/authRoutes.js";
import crudRoutes from "./routes/crudRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import swaggerDocument from "./docs/swagger.js";

const app = express();
const swaggerOptions = {
  definition: {
    ...swaggerDocument,
    openapi: "3.0.0",
    info: {
      title: "Lista de jogos",
      version: "1.0.0",
      description: "Documentação da API de jogos"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor da API de jogos"
      }
    ],
    components: {
      ...swaggerDocument.components,
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "Informe o token no formato: Bearer TOKEN_SECRETO"
        }
      }
    }
  },
  apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use("/uploads", express.static(path.resolve("src/uploads")));

app.get("/", (_req, res) => {
  res.json({ mensagem: "Servidor Express funcionando!", disciplina: "Desenvolvimento de Websites", bimestre: "3º bimestre" });
});

app.use(authRoutes);
app.use(crudRoutes);
app.use(uploadRoutes);
app.get("/swagger.json", (_req, res) => res.json(swaggerSpec));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ mensagem: "Erro interno do servidor" });
});

export default app;