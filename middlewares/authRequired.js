import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../config.js";

/* export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Autorizacion denegada" });
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY, (err, user) => {
      if (err) return res.status(401).json({ message: "Token invalido" });
      req.usuario = user;
      next();
    });
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
 */

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json([{ message: "Forbidden" }]);

    req.user = user;

    next();
  });
};

module.exports = { requireAuth };
