import { registrarBitacora } from "../services/bitacora.js";
import model from "../models/index.js";
import { registrarBitacora } from "../services/bitacora.js";

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
  try {
    await crearMicro(placa, interno, modelo, año, seguro, dueño);
    const micro = crearMicro.id;
    const microRegistrado = await model.trabajan.create({
      id_lineas: linea,
      id_micro: micro,
    });
    registrarBitacora(
      token.id,
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
