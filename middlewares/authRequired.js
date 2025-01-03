import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.body;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Autorizacion denegada" });
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY, (err, user, rol) => {
      if (err) return res.status(401).json({ message: "Token invalido" });
      req.usuario = user;
      req.rol = rol;
      next();
    });
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};