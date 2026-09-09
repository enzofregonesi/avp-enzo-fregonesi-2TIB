import express from "express";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes.js";
import crudRoutes from "./routes/crudRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import swaggerDocument from "./docs/swagger.js";

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.resolve("src/uploads")));

app.get("/", (_req, res) => {
  res.json({ mensagem: "Servidor Express funcionando!", disciplina: "Desenvolvimento de Websites", bimestre: "3º bimestre" });
});

app.use(authRoutes);
app.use(crudRoutes);
app.use(uploadRoutes);
app.get("/swagger.json", (_req, res) => res.json(swaggerDocument));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ mensagem: "Erro interno do servidor" });
});

export default app;