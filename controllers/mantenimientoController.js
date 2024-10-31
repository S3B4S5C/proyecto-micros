import { registrarBitacora } from "../services/bitacora.js";
import model from "../models/index.js";
import { getToday, getNow } from "../utils/dates.js";
import { uuid } from "uuidv4";
import { userFromToken, idLineaFromToken } from "../services/auth.js";

export const nuevoMantenimiento = async (req, res) => {
    const { descripcion, interno, token } = req.body;
    let { fecha } = req.body;
    const mantenimiento = uuid();
    
    try{
      const id_linea = idLineaFromToken(token);
      const operador = userFromToken(token);
      if (!fecha){
        fecha = getToday();
      }
      const micro = await model.micro.findOne({
        where: { interno },
        include: [
          {
            model: model.linea,
            required: true,
            where: { id_linea },
          },
        ],
      });
      const mantenimientoRegistrado = await model.mantenimiento.create({
        id_mantenimiento: mantenimiento,
        fecha,
        descripcion:descripcion,
        id_micro: micro.dataValues.id_micro
      });
      await registrarBitacora(
        operador,
        "CREACION",
        `Al micro ${interno} se le ha asginado un mantenimiento`,
        id_linea
      )
      res.status(201).json({
        message: "Mantenimiento registrado con éxito", mantenimiento: mantenimientoRegistrado
      });
    }catch(error){
      res
        .status(500)
        .json({ message: "Error al registrar el mantenimiento", error: error.message });
    }
  };