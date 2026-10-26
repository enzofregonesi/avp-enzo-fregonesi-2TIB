import "dotenv/config";
import app from "./app.js";
import prisma from "./config/prisma.js";

const port = Number(process.env.PORT) || 3000;
const jwtSecret = process.env.JWT_SECRET || process.env.TOKEN_SECRETO;

if (!jwtSecret || jwtSecret.length < 32) {
  console.error("Configure JWT_SECRET com pelo menos 32 caracteres no arquivo .env");
  process.exit(1);
}

try {
  await prisma.$connect();
  const server = app.listen(port, () => {
    console.log(`API disponível em http://localhost:${port}`);
  });

  async function encerrar() {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  process.on("SIGINT", encerrar);
  process.on("SIGTERM", encerrar);
} catch (error) {
  console.error("Não foi possível iniciar a API. Verifique DATABASE_URL e se o MySQL está ativo.");
  console.error(error.message);
  await prisma.$disconnect();
  process.exitCode = 1;
}