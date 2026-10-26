import * as jogosModel from "../models/jogosModel.js";

function validarId(id) {
  const numero = Number(id);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

function validarDadosJogo(dados, parcial = false) {
  const camposPermitidos = ["nome", "genero"];
  const chaves = Object.keys(dados);
  if (chaves.some((campo) => !camposPermitidos.includes(campo))) return false;
  if (parcial && chaves.length === 0) return false;
  if (!parcial && (!dados.nome || !dados.genero)) return false;

  return chaves.every((campo) => typeof dados[campo] === "string" && dados[campo].trim().length > 0)
    && (!dados.nome || dados.nome.trim().length <= 100)
    && (!dados.genero || dados.genero.trim().length <= 50);
}

export async function listarJogos(_req, res) {
  res.json(await jogosModel.listarJogos());
}

export async function buscarJogo(req, res) {
  const id = validarId(req.params.id);
  if (!id) return res.status(400).json({ mensagem: "ID inválido" });
  const jogo = await jogosModel.buscarJogoPorId(id);
  if (!jogo) return res.status(404).json({ mensagem: "Jogo não encontrado" });
  res.json(jogo);
}

export async function criarJogo(req, res) {
  if (!validarDadosJogo(req.body)) {
    return res.status(400).json({ mensagem: "Informe nome e gênero válidos para o jogo" });
  }
  const jogo = await jogosModel.criarJogo({ nome: req.body.nome.trim(), genero: req.body.genero.trim() });
  res.status(201).json({ mensagem: "Jogo cadastrado com sucesso", jogo });
}

export async function atualizarJogo(req, res) {
  const id = validarId(req.params.id);
  if (!id) return res.status(400).json({ mensagem: "ID inválido" });
  if (!validarDadosJogo(req.body, true)) {
    return res.status(400).json({ mensagem: "Informe ao menos um campo válido: nome ou genero" });
  }
  const existente = await jogosModel.buscarJogoPorId(id);
  if (!existente) return res.status(404).json({ mensagem: "Jogo não encontrado" });

  const dados = Object.fromEntries(Object.entries(req.body).map(([campo, valor]) => [campo, valor.trim()]));
  const jogo = await jogosModel.atualizarJogo(id, dados);
  res.json({ mensagem: "Jogo atualizado com sucesso", jogo });
}

export async function excluirJogo(req, res) {
  const id = validarId(req.params.id);
  if (!id) return res.status(400).json({ mensagem: "ID inválido" });
  const existente = await jogosModel.buscarJogoPorId(id);
  if (!existente) return res.status(404).json({ mensagem: "Jogo não encontrado" });
  const jogo = await jogosModel.excluirJogo(id);
  res.json({ mensagem: "Jogo removido com sucesso", jogo });
}