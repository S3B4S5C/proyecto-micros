import { uuid } from "uuidv4";
import { getNow, getToday } from "../utils/dates.js";
import { userFromToken, idLineaFromToken } from "../services/auth.js";
import model from "../models/index.js";
import Sequelize from "sequelize";
import { registrarBitacora } from "../services/bitacora.js";


export const registrarNotificacion = async(req, res) => {
    const { token, tipo, contenido} = req.body;
    let { fecha , hora} = req.body;
    const operador = userFromToken(token)
    const id_linea = idLineaFromToken(token);
    const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress;
    const notificacion = uuid()

    try {
        if(!fecha){
            fecha =  getToday()
        }
        if(!hora){
            hora= getNow()
        }
        const nuevaNotificacion = await model.notificacion.create({
            id_notificacion: notificacion,
            tipo,
            contenido,
            usuario_operador: operador,
            fecha,
            hora
        })
        registrarBitacora(
            operador,
            "CREACIÓN",
            `Notificación ${tipo} se ha creado`,
            ip,
            id_linea
          )
        res.status(201).json({ message : "Notificación registada con éxito", nuevaNotificacion})
    }catch(error){
        res.status(500).json({
            message: "Error al registrar el horario",
            error: error.message,
          });
    }
}

export const eliminarNotificacion = async (req, res) => {
    const {token, id_notificacion} = req.body;
    const operador = userFromToken(token)
    const id_linea = idLineaFromToken(token);
    const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress;
    try{
        const notificacion = await model.notificacion.findByPk(id_notificacion)
        
        if(!notificacion){
            return res.status(404).json({message: "Notificacion no encontrado"});
        }
        const tipo = notificacion.tipo
        await notificacion.destroy();
        registrarBitacora(
            operador,
            "ELIMINACIÓN",
            `Notificación ${tipo}  se ha eliminado`,
            ip,
            id_linea
          )
          res.status(200).json({ message: "Notificación eliminada con éxito" });
    }catch(error){
        res
      .status(500)
      .json({ message: "Error al eliminar la notificación", error: error.message });
    }
}

export const getNotificacionesLinea = async(req, res) => {
    const {token} = req.body
    const operador = userFromToken(token)
    try{
        const notificaciones = await model.notificacion.findAll({
            where: { usuario_operador:operador}
        })
        if(!notificaciones){
            return res.status(404).json({message: "No existen notificaciones para esta linea"});
        }
        return res.status(200).json(notificaciones);
    }catch(error){
        res
      .status(500)
      .json({ message: "Error al obtener las notificaciones", error: error.message });
    }
}