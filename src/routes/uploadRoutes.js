import express from "express";
import multer from "multer";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", (req, res) => {
  upload.single("imagem")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const mensagem = error.code === "LIMIT_FILE_SIZE"
        ? "A imagem deve ter no máximo 2MB"
        : "Envie apenas uma imagem PNG, JPG ou JPEG no campo imagem";
      return res.status(400).json({ mensagem });
    }
    if (error) return res.status(400).json({ mensagem: "Falha ao validar o upload" });
    if (!req.file) return res.status(400).json({ mensagem: "O campo imagem é obrigatório" });

    res.status(201).json({
      mensagem: "Imagem enviada com sucesso",
      arquivo: {
        nome: req.file.filename,
        tamanho: req.file.size,
        caminho: `/uploads/${req.file.filename}`
      }
    });
  });
});

export default router;