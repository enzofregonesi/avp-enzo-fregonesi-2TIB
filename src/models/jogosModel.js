import  prisma from "../config/prisma.js";

export function criarJogo({nome,genero }) {
  return prisma.jogo.create({
    data: {
      nome,
      genero
    }
  });
}

export function listarJogos() {
    return prisma.jogo.findMany({
        orderBy: {
            id: "asc"
        }
    });