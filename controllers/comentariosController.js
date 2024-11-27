import { getToday, getNow } from "../utils/dates.js";
import model from "../models/index.js";
import { uuid } from "uuidv4";

export const crearComentario = async (req, res) => {
  const { titulo, descripcion, tipo_comentario, token, id_linea } = req.body;
  const usuario = userFromToken(token);
  const id_comentario = uuid();
  const fecha = getToday();
  const hora = getNow();
  const comentario = await model.comentario.create({
    id_comentario,
    fecha,
    hora,
    titulo,
    descripcion,
    tipo_comentario,
    id_linea,
    usuario,
  });
  return res.status(200).json(comentario);
};

export const getComentarios = async (req, res) => {
  const { id_linea } = req.body;
  const comentarios = await model.comentario.findAll({
    where: { id_linea },
  });
  return res.status(200).json(comentarios);
};
