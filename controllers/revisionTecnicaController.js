import { registrarBitacora } from "../services/bitacora.js";
import model from "../models/index.js";
import { getToday, getNow } from "../utils/dates.js";
import { uuid } from "uuidv4";
import { userFromToken, idLineaFromToken } from "../services/auth.js";

export const registrarRevision = async (req, res) =>{
    const { token, interno , detalle, estado, proximaFecha} = req.body;
    let { fecha } = req.body;
    const revision = uuid();
    const operador = userFromToken(token);
    try{
        const id_linea = idLineaFromToken(token);
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

        const revisionTecnicaRegistrada = await model.revisionTecnica.create({
            id_revision: revision,
            detalle,
            estado,
            fecha_revision: fecha,
            fecha_proxima_revision: proximaFecha,
            id_micro: micro.id_micro
        })
        await registrarBitacora(
            operador,
            "CREACION",
            `Al micro ${interno} se le ha registrado una revisión`,
            id_linea
        )
        res.status(201).json({
            message: "Revisión técnica registrada con éxito", revisión: revisionTecnicaRegistrada
          });

    }catch(error){
        res
        .status(500)
        .json({ message: "Error al registrar la revision", error: error.message });
    }

}


export const actualizarFechaProxima = async(req, res)=> {
    
}
