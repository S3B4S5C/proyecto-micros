import { idLineaFromToken } from "../services/auth.js";
import { uuid } from "uuidv4";
import model from "../models/index.js";
import { getNow, getToday } from "../utils/dates.js";

export const GetLastMensajes = async (req, res) => {
  const { token } = req.body;
  const id_linea = idLineaFromToken(token);
  try {
    const mensajes = await model.mensaje.findAll({
      where: { id_linea },
      limit: 10,
      order: [
        ["fecha", "DESC"],
        ["hora", "DESC"],
      ],
    });
    res.status(200).json(mensajes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los mensajes", error: error.message });
  }
};

export const getMensajes = async (req, res) => {
  const { token } = req.body;
  const id_linea = idLineaFromToken(token);
  try {
    const mensajes = await model.mensaje.findAll({
      where: { id_linea },
      order: [
        ["fecha", "ASC"],
        ["hora", "ASC"],
      ],
    });
    res.status(200).json(mensajes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los mensajes", error: error.message });
  }
}  

export const newMensaje = async (id_linea, contenido, emisor) => {
  const id_mensaje = uuid();
  const fecha = getToday();
  const hora = getNow();
  try {
    await model.mensaje.create({
        id_mensaje,
        contenido,
        id_linea,
        fecha,
        hora,
        emisor
    })
  } catch (error) {
    console.log(error);
  }
}
