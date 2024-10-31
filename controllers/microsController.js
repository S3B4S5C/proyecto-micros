import { registrarBitacora } from "../services/bitacora.js";
import model from "../models/index.js";
import { getToday, getNow } from "../utils/dates.js";
import { uuid } from "uuidv4";
import { userFromToken, idLineaFromToken } from "../services/auth.js";

const existePlaca = async (placa) => {
  const placaExistente = await model.micro.findOne({
    where: { placa },
  });
  return placaExistente !== null;
};

export const registrarMicro = async (req, res) => {
  const { placa, interno, modelo, año, seguro, dueño, token } = req.body;
  const operador = userFromToken(token);
  const id_linea = idLineaFromToken(token);
  try {
    if (await existePlaca(placa))
      return res.status(500).json({message: `La placa ${placa} ya esta en uso`});

    const microRegistrado= await model.micro.create({
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
      `Micro ${micro} se ha eliminado con éxito`
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

export const nuevoMantenimiento = async (req, res) => {};
