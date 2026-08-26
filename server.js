import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const jogos = [
  { id: 1, nome: "Minecraft", genero: "Aventura" },
  { id: 2, nome: "FIFA 25", genero: "Esporte" },
  { id: 3, nome: "Super Mario Bros. Wonder", genero: "Plataforma" },
  { id: 4, nome: "The Legend of Zelda: Tears of the Kingdom", genero: "Aventura" },
  { id: 5, nome: "Forza Horizon 5", genero: "Corrida" },
  { id: 6, nome: "Stardew Valley", genero: "Simulação" },
  { id: 7, nome: "Hades", genero: "Ação" },
  { id: 8, nome: "EA Sports FC 25", genero: "Esporte" }
];

app.get("/", (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    disciplina: "Desenvolvimento de Websites",
    bimestre: "3º bimestre"
  });
});

app.get("/jogos", (req, res) => {
  res.json(jogos);
});

app.get("/jogos/:id", (req, res) => {
  const id = Number(req.params.id);

  const jogo = jogos.find((jogo) => jogo.id === id);

  if (!jogo) {
    return res.status(404).json({
      message: "Jogo não encontrado"
    });
  }

  res.json(jogo);
});

app.post("/jogos", (req, res) => {
  const novoJogo = {
    id: jogos.length + 1,
    nome: req.body.nome,
    genero: req.body.genero
  };

  jogos.push(novoJogo);

  res.status(201).json({
    mensagem: "Jogo cadastrado com sucesso",
    jogo: novoJogo
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
