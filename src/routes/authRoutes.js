import express from "express";
import { cadastrarUsuario, realizarLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/usuarios", cadastrarUsuario);
router.post("/login", realizarLogin);

export default router;