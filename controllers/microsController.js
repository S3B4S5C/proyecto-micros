import { registrarBitacora } from "../services/bitacora.js";
import model from "../models/index.js";
import { getToday, getNow } from "../utils/dates.js";
import { uuid } from "uuidv4";
import { userFromToken, idLineaFromToken } from "../services/auth.js";
import mensajesModelo from "../models/mensajes.js";

const existePlaca = async (placa) => {
  const placaExistente = await model.micro.findOne({
    where: { placa },
  });
  return placaExistente !== null;
};

const existeInterno = async (interno) => {
  const internoExistente = await model.micro.findOne({
    where: { interno },
  });
  return internoExistente !== null;
};

export const registrarMicro = async (req, res) => {
  const { placa, interno, modelo, año, seguro, dueño, token } = req.body;
  const operador = await userFromToken(token);
  const id_linea = await idLineaFromToken(token);
  console.log(placa, interno, modelo, año, seguro, dueño, token);
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
  try {
    if (await existePlaca(placa))
      return res
        .status(500)
        .json({ message: `La placa ${placa} ya esta en uso` });
    if (await existeInterno(interno))
      return res
        .status(500)
        .json({ message: `El interno ${interno} ya esta en uso` });
    const microRegistrado = await model.micro.create({
      placa,
      interno,
      modelo,
      año,
      seguro,
      id_dueño: dueño,
      id_linea,
    });
    await registrarBitacora(
      operador,
      "CREACION",
      `Micro ${microRegistrado} se ha creado correctamente`,
      ip,
      ip,
      id_linea
    );
    res
      .status(201)
      .json({ message: "Micro registrado con éxito", micro: microRegistrado });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar el micro ",
      error: error.message,
    });
  }
};

export const eliminarMicro = async (req, res) => {
  const { token } = req.body;
  const { id } = req.params;
  const id_linea = idLineaFromToken(req.body.token);
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
  try {
    const trabajan = await model.trabajan.findByPK(id);
    if (!trabajan) {
      return res.status(404).json({
        message: "Micro no encontrado",
      });
    }
    const micro = await model.micro.findByPk(trabajan.id_micro);
    await trabajan.destroy();
    if (micro) {
      await micro.destroy();
    }
    registrarBitacora(
      token.id,
      "ELIMINACION",
      `Micro ${micro} se ha eliminado con éxito`,
      ip,
      id_linea
    );
    res.status(200).json({ message: "Micro eliminado con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el micro", error: error.message });
  }
};

export const setEstado = (req, res) => {
  const { estado, id_micro, token } = req.body;
  const fecha = getToday();
  const hora = getNow();
  try {
    const id_estado = uuid();
    const estadoRegistrado = model.estado.create({
      id_estado,
      estado,
      fecha,
      hora,
      id_micro,
    });
    res
      .status(200)
      .json({ message: "Estado registrado con exito", estadoRegistrado });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar el estado", error: error.message });
  }
};

export const getEstadoActual = async (req, res) => {
  const { id_micro } = req.params;

  try {
    const estadoActual = await model.estado.findOne({
      where: { id_micro },
      order: [
        ["fecha", "DESC"],
        ["hora", "DESC"],
      ],
    });

    if (!estadoActual) {
      return res.status(404).json({
        message: "No se encontró ningún estado para el micro indicado.",
      });
    }

    res.status(200).json(estadoActual);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el estado actual",
      error: error.message,
    });
  }
};

export const getMicrosPorLineaConEstado = async (req, res) => {
  const { token } = req.body;
  const linea = idLineaFromToken(token);
  try {
    const micros = await model.micro.findAll({
      include: [
        {
          model: model.linea,
          where: { id_linea: linea },
          attributes: [],
        },
        {
          model: model.estado,
          order: [
            ["fecha", "DESC"],
            ["hora", "DESC"],
          ],
          limit: 1,
        },
        {
          model: model.dueño,
          required:true,
          include: [
            {
              model: model.informacionesPersonales,
              attributes: ['nombre'],
              required: true
            }
          ]
        }
      ],
    });
    
    if (!micros.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron micros para esta línea." });
    }
    res.status(200).json(micros);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los micros por línea",
      error: error.message,
    });
  }
};

export const getMicrosPorLineaDisponibles = async (req, res) => {
  const { token } = req.body;
  const id_linea = idLineaFromToken(token);
  try {
    const micros = await model.micro.findAll({
      include: [
        {
          model: model.trabajan,
          where: { id_linea },
          attributes: [],
        },
        {
          model: model.estado,
          where: { estado: "DISPONIBLE" },
          order: [
            ["fecha", "DESC"],
            ["hora", "DESC"],
          ],
          limit: 1,
        },
      ],
    });

    if (!micros.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron micros para esta línea." });
    }

    res.status(200).json(micros);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los micros por línea",
      error: error.message,
    });
  }
};

