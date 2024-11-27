import { uuid } from "uuidv4";
import { getNow, getToday } from "../utils/dates.js";
import { userFromToken, idLineaFromToken } from "../services/auth.js";
import model from "../models/index.js";
import Sequelize from "sequelize";
import { registrarBitacora } from "../services/bitacora.js";

export const registrarIncidente = async(req, res) => {
    const { token, turno , tipo, estado,descripcion } = req.body;
    const operador = userFromToken(token);
    const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress; 
    
}