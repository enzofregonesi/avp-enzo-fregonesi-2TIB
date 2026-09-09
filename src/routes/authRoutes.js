import express from "express";
import bcrypt from "bcrypt";
import { tokens, usuarios } from "../data.js";

const router = express.Router();
const TOKEN_FIXO = "AV2-TOKEN-2026";

router.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "nome, email e senha são obrigatórios" });
  }

  if (usuarios.some((usuario) => usuario.email === email)) {
    return res.status(409).json({ mensagem: "E-mail já cadastrado" });
  }

  const usuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha: await bcrypt.hash(senha, 10)
  };
  usuarios.push(usuario);

  res.status(201).json({
    mensagem: "Usuário cadastrado com sucesso",
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
  });
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find((item) => item.email === email);
  const senhaValida = usuario && await bcrypt.compare(senha || "", usuario.senha);

  if (!senhaValida) {
    return res.status(401).json({ mensagem: "E-mail ou senha inválidos" });
  }

  tokens.set(TOKEN_FIXO, { id: usuario.id, nome: usuario.nome, email: usuario.email });

  res.json({ mensagem: "Login realizado com sucesso", token: TOKEN_FIXO });
});

export default router;