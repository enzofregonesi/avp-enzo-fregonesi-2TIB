import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, token, extra] = authorization.split(" ");

  if (scheme !== "Bearer" || !token || extra) {
    return res.status(401).json({ mensagem: "Token ausente ou inválido" });
  }

  const segredo = process.env.JWT_SECRET || process.env.TOKEN_SECRETO;
  if (!segredo || segredo.length < 32) {
    return res.status(500).json({ mensagem: "A autenticação não está configurada no servidor" });
  }

  try {
    const payload = jwt.verify(token, segredo);
    req.usuario = { id: Number(payload.sub), email: payload.email };
    next();
  } catch {
    return res.status(401).json({ mensagem: "Token expirado ou inválido" });
  }
}