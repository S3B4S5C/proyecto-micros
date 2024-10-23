import model from "../models/index.js";
import { uuid } from "uuidv4";



export const registrarBitacora = async (usuario_bitacora, tipo, accion) => {
    await model.bitacora.sync()
    const fechaActual = new Date();

    const fechaLegible = fechaActual.toLocaleDateString(); 
    const [day, month, year] = fechaLegible.split('/');
    const fechaISO = `${year}-${month}-${day}`;
    const horaLegible = fechaActual.toLocaleTimeString();
    console.log("Hola");
    console.log(fechaISO);
    console.log(fechaLegible, horaLegible);

    await model.bitacora.create({
        id_bitacora: uuid(),
        usuario_bitacora,
        tipo,
        accion,
        fecha: `${fechaISO}`,
        hora: `${horaLegible}`
    });
}