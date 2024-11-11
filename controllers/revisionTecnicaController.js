import { registrarBitacora } from "../services/bitacora.js";
import model from "../models/index.js";
import { getToday, getNow } from "../utils/dates.js";
import { uuid } from "uuidv4";
import { userFromToken, idLineaFromToken } from "../services/auth.js";

export const registrarRevision = async (req, res) => {
  const { token, interno, detalle, estado, proximaFecha } = req.body;
  let { fecha } = req.body;
  const revision = uuid();
  const operador = userFromToken(token);
  try {
    const id_linea = idLineaFromToken(token);
    if (!fecha) {
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
      id_micro: micro.id_micro,
    });
    await registrarBitacora(
      operador,
      "CREACION",
      `Al micro ${interno} se le ha registrado una revisión`,
      id_linea
    );
    res.status(201).json({
      message: "Revisión técnica registrada con éxito",
      revisión: revisionTecnicaRegistrada,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar la revision",
      error: error.message,
    });
  }
};

export const actualizarFechaProxima = async (req, res) => {
  const { token, estado, revision } = req.body;
  const operador = userFromToken(token);
  const id_linea = idLineaFromToken(token);
  const datos = {
    ...(estado && { estado })
  }
  try{
    await model.revisionTecnica.update(datos, {
      where: {
        id_revision: revision
      }
    })
    registrarBitacora(
      operador,
      "ACTUALIZACION",
      `La revisión ${revision} ha sido actualizada`,
      id_linea
    );
    res.status(201).json({
      datos: {
        estado: estado,
      },
      message: "revision actualizada con exito ",
    });
  }catch(error){
    res
      .status(500)
      .json({ message: "Error al actualizar la revisión", error: error.message });

  }
}


export const getRevisionesMicro = async (req, res)=>{
  const { token, interno }= req.body;
  try{
    const linea = idLineaFromToken(token);
    const micro = await model.micro.findOne({
      where: { interno },
      include: [
        { model: model.linea,
          required: true,
          where: { id_linea: linea}
        }
      ]
    })
    if(!micro){
      return res.status(404).json({ message: "Micro no encontrado para esta línea" });
    }
    const revisiones = await model.revisionTecnica.findAll({
      include:[
        {
           model: model.micro,
           required: true, 
           where: { id_linea: linea, id_micro: micro.id_micro},
           attributes: []
        }
      ]
    })
    if(!revisiones.length){
      return res.status(404).json({ message: "No se encontraron revisiones para este micro"})
    }
    res.status(200).json(revisiones)
  }catch(error){
    res.status(500).json({
      message: "Error al obtener las revisiones por micro", error: error.message,
  })
  }
}


export const getRevisionesLinea = async(req, res) => {
  const {token} = req.body;
  try{ 
    const linea = idLineaFromToken(token);
    const revisiones = await model.revisionTecnica.findAll({
      include: [
        {
          model: model.micro,
          where: { id_linea: linea},
          attributes: []
        }
      ]
    })
    if(!revisiones.length){
      return res.status(404).json({ message: "No se encontraron revisiones para esta linea"})
    }
    res.status(200).json(revisiones);
  }catch(error){
    res.status(500).json({
      message: "Error al obtener las revisiones por linea", error: error.message,
  })
  }
}
