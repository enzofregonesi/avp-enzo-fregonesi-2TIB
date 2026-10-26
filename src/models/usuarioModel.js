import prisma from "../config/prisma.js";

export function buscarUsuarioPorEmail(email) {
  return prisma.usuario.findUnique({ where: { email } });
}

export function buscarUsuarioPorId(id) {
  return prisma.usuario.findUnique({ where: { id } });
}

export function criarUsuario(dados) {
  return prisma.usuario.create({ data: dados });
}