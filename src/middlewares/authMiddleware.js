import { tokens } from "../data.js";

export function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") || [];

  if (scheme !== "Bearer" || !token || !tokens.has(token)) {
    return res.status(401).json({ mensagem: "Token ausente ou inválido" });
  }

  req.usuario = tokens.get(token);
  next();
}