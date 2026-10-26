import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

if (!process.env.DATABASE_URL) {
	throw new Error("A variável DATABASE_URL não está definida no arquivo .env");
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const prisma = new PrismaClient({ adapter });

export default prisma;
