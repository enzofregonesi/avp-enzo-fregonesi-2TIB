import express from "express";
import { jogos } from "../data.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

function criarRotasCrud(collection, nomeSingular) {
  router.get(`/${nomeSingular}`, authMiddleware, (_req, res) => res.json(collection));

  router.get(`/${nomeSingular}/:id`, authMiddleware, (req, res) => {
    const item = collection.find((registro) => registro.id === Number(req.params.id));
    if (!item) return res.status(404).json({ mensagem: `${nomeSingular} não encontrado` });
    res.json(item);
  });

  router.post(`/${nomeSingular}`, authMiddleware, (req, res) => {
    const { nome, genero } = req.body;
    const novoItem = {
      id: collection.length ? Math.max(...collection.map((item) => item.id)) + 1 : 1,
      ...(nome !== undefined ? { nome } : {}),
      ...(genero !== undefined ? { genero } : {})
    };

    if (Object.keys(novoItem).length === 1) {
      return res.status(400).json({ mensagem: "Informe os dados do item" });
    }

    collection.push(novoItem);
    res.status(201).json({ mensagem: `${nomeSingular} criado com sucesso`, [nomeSingular]: novoItem });
  });

  router.put(`/${nomeSingular}/:id`, authMiddleware, (req, res) => {
    const item = collection.find((registro) => registro.id === Number(req.params.id));
    if (!item) return res.status(404).json({ mensagem: `${nomeSingular} não encontrado` });

    Object.assign(item, req.body);
    delete item.id;
    item.id = Number(req.params.id);
    res.json({ mensagem: `${nomeSingular} atualizado com sucesso`, [nomeSingular]: item });
  });

  router.delete(`/${nomeSingular}/:id`, authMiddleware, (req, res) => {
    const index = collection.findIndex((registro) => registro.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ mensagem: `${nomeSingular} não encontrado` });

    const [removido] = collection.splice(index, 1);
    res.json({ mensagem: `${nomeSingular} removido com sucesso`, [nomeSingular]: removido });
  });
}

criarRotasCrud(jogos, "jogos");

export default router;