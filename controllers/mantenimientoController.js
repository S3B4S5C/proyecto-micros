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
        `Al micro ${interno} se le ha asignado un mantenimiento`,
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

export const getMantenimientosPorLinea = async ( req, res) => {
    const { token } = req.body;
    try{
        const linea = idLineaFromToken(token);
        const mantenimientos = await model.mantenimiento.findAll({
            include: [
                { 
                    model: model.micro,
                    where: {id_linea: linea },
                    attributes: [],
                }
            ]
        })
        if(!mantenimientos.length){
            return res.status(404).json({ message: "No se encontraron mantenimientos para esta linea"})
        }
        res.status(200).json(mantenimientos);
    }catch(error){
        res.status(500).json({
            message: "Error al obtener los mantenimientos por linea", error: error.message,
        })
    }
}

export const getMantenimientosPorMicros = async ( req, res) => {
    const { token, interno } = req.body;
    try{
        const linea = idLineaFromToken(token);
        const micro = await model.micro.findOne({
            where: { interno },
            include: [
              {
                model: model.linea,
                required: true,
                where: { id_linea: linea },
              },
            ],
          });
          if (!micro) {
            return res.status(404).json({ message: "Micro no encontrado para esta línea" });
          }
        const mantenimientos = await model.mantenimiento.findAll({
            include: [
                { 
                    model: model.micro,
                    where: {id_linea: linea, id_micro: micro.id_micro},
                    attributes: [],
                },
            ]
        })
        if(!mantenimientos.length){
            return res.status(404).json({ message: "No se encontraron mantenimientos para este micro"})
        }
        res.status(200).json(mantenimientos);
    }catch(error){
        res.status(500).json({
            message: "Error al obtener los mantenimientos por micro", error: error.message,
        })
    }
}