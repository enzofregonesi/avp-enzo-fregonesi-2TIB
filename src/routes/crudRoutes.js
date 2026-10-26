import express from "express";
import {
	atualizarJogo,
	buscarJogo,
	criarJogo,
	excluirJogo,
	listarJogos
} from "../controllers/crudController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/jogos", authMiddleware, listarJogos);
router.get("/jogos/:id", authMiddleware, buscarJogo);
router.post("/jogos", authMiddleware, criarJogo);
router.put("/jogos/:id", authMiddleware, atualizarJogo);
router.delete("/jogos/:id", authMiddleware, excluirJogo);

export default router;