import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as usuarioModel from "../models/usuarioModel.js";

function obterSegredoJwt() {
  const segredo = process.env.JWT_SECRET || process.env.TOKEN_SECRETO;
  if (!segredo || segredo.length < 32) {
    throw new Error("Configure JWT_SECRET com pelo menos 32 caracteres no arquivo .env");
  }
  return segredo;
}

export async function cadastrarUsuario(req, res) {
  const { nome, email, senha } = req.body || {};
  const emailNormalizado = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (typeof nome !== "string" || nome.trim().length < 2 || nome.trim().length > 100) {
    return res.status(400).json({ mensagem: "Nome deve ter entre 2 e 100 caracteres" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
    return res.status(400).json({ mensagem: "Informe um e-mail válido" });
  }
  if (typeof senha !== "string" || senha.length < 6 || senha.length > 72) {
    return res.status(400).json({ mensagem: "Senha deve ter entre 6 e 72 caracteres" });
  }

  const existente = await usuarioModel.buscarUsuarioPorEmail(emailNormalizado);
  if (existente) return res.status(409).json({ mensagem: "E-mail já cadastrado" });

  const usuario = {
    nome: nome.trim(),
    email: emailNormalizado,
    senha: await bcrypt.hash(senha, 10)
  };

  try {
    const criado = await usuarioModel.criarUsuario(usuario);
    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      usuario: { id: criado.id, nome: criado.nome, email: criado.email }
    });
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ mensagem: "E-mail já cadastrado" });
    throw error;
  }
}

export async function realizarLogin(req, res) {
  const { email, senha } = req.body || {};
  const emailNormalizado = typeof email === "string" ? email.trim().toLowerCase() : "";
  const usuario = emailNormalizado ? await usuarioModel.buscarUsuarioPorEmail(emailNormalizado) : null;
  const senhaValida = usuario && typeof senha === "string" && await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    return res.status(401).json({ mensagem: "E-mail ou senha inválidos" });
  }

  const token = jwt.sign(
    { email: usuario.email },
    obterSegredoJwt(),
    { subject: String(usuario.id), expiresIn: "1h" }
  );

  res.json({ mensagem: "Login realizado com sucesso", token, tipo: "Bearer", expiraEm: "1h" });
}