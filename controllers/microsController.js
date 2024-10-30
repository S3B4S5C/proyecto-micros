import { registrarBitacora } from "../services/bitacora.js";
import model from "../models/index.js";
import { getToday, getNow } from "../utils/dates.js";
import { uuid } from "uuidv4";
import { userFromToken } from "../services/auth.js";
const existePlaca = async (placa) => {
  const placaExistente = await model.micro.findOne({
    where: { placa },
  });
  return placaExistente !== null;
};

const crearMicro = async (placa, interno, modelo, año, seguro, dueño) => {
  if (await existePlaca(placa))
    throw new Error({ message: `La placa ${placa} ya esta en uso` });
  await model.micro.create({
    placa: placa,
    interno: interno,
    modelo: modelo,
    año: año,
    seguro: seguro,
    id_dueño: dueño,
  });
};

export const registrarMicro = async (req, res) => {
  const { placa, interno, modelo, año, seguro, dueño, token, linea } = req.body;
  const operador = userFromToken(token);
  try {
    await crearMicro(placa, interno, modelo, año, seguro, dueño);
    const micro = crearMicro.id;
    const microRegistrado = await model.trabajan.create({
      id_lineas: linea,
      id_micro: micro,
    });
    registrarBitacora(
      operador,
      "CREACION",
      `Micro ${microRegistrado} se ha creado correctamente`,
    );
    res
      .status(201)
      .json({ message: "Micro registrado con éxito", micro: microRegistrado });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar el micro", error: error.message });
  }
};

export const eliminarMicro = async (req, res) => {
  const { token } = req.body;
  const { id } = req.params;
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
    const estadoActual = await model.estados.findOne({
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
  const { linea } = req.body;
  try {
    const micros = await model.micro.findAll({
      include: [
        {
          model: model.trabajan,
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

export const nuevoMantenimiento = async (req, res) => {
    
}