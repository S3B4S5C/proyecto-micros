import model from "../models/index.js";
import { uuid } from "uuidv4";
import { getNow, getToday } from "../utils/dates.js";

export const registrarBitacora = async (usuario_bitacora, tipo, accion,ip, id_linea) => {
   
    await model.bitacora.sync()
    const fechaISO = getToday();
    const horaLegible = getNow();
    console.log(fechaISO,horaLegible);
    await model.bitacora.create({
        id_bitacora: uuid(),
        usuario_bitacora,
        tipo,
        accion,
        fecha: `${fechaISO}`,
        hora: `${horaLegible}`,
        ip,
        id_linea, 

    });
};