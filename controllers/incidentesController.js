import model from "../models/index.js";
import { uuid } from "uuidv4";
import { getNow } from "../utils/dates.js";
import { idLineaFromToken } from "../services/auth.js";


export const registrarIncidente = async (req, res) => {
    const { descripcion, tipo, id_turno, token } = req.body;
    const hora = getNow();
    const id_incidente = uuid();
    const id_linea = idLineaFromToken(token);
    const estado = "Pendiente";
    try {
        const incidente = await model.incidente.create({ id_incidente, descripcion, estado, tipo, id_turno, hora, id_linea });
        const turno = await model.turno.findByPk(id_turno);
        turno.hora_llegada = hora;
        await turno.save();
        res.status(200).json(incidente);
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el incidente", error: error.message });
    }
}


export const getAllIncidentes = async (req, res) => {
    const { id_linea } = req.body;
    try {
        const incidentes = await model.incidente.findAll({
            where: { id_linea }
        });
        res.status(200).json(incidentes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los incidentes", error: error.message });
    }
}

export const getIncidentes = async (req, res) => {
    const { id_linea } = req.body;
    try {
        const incidentes = await model.incidente.findAll({
            where: { id_linea, estado: "Pendiente" }
        });
        res.status(200).json(incidentes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los incidentes", error: error.message });
    }
}

export const finalizarIncidente = async (req, res) => {
    const { id_incidente } = req.body;
    try {
        const incidente = await model.incidente.findByPk(id_incidente);
        incidente.estado = "Finalizado";
        await incidente.save();
        res.status(200).json(incidente);
    } catch (error) {
        res.status(500).json({ message: "Error al finalizar el incidente", error: error.message });
    }
}