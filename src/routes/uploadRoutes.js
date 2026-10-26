import express from "express";
import { enviarImagem } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/upload", enviarImagem);

export default router;