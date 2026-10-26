import prisma from "../config/prisma.js";

export function listarJogos() {
  return prisma.jogo.findMany({ orderBy: { id: "asc" } });
}

export function buscarJogoPorId(id) {
  return prisma.jogo.findUnique({ where: { id } });
}

export function criarJogo(dados) {
  return prisma.jogo.create({ data: dados });
}

export function atualizarJogo(id, dados) {
  return prisma.jogo.update({ where: { id }, data: dados });
}

export function excluirJogo(id) {
  return prisma.jogo.delete({ where: { id } });
}

