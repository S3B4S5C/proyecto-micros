import { registrarBitacora } from "../services/bitacora.js";
import model from "../models/index.js";
import { getToday, getNow } from "../utils/dates.js";
import { uuid } from "uuidv4";
import { userFromToken, idLineaFromToken } from "../services/auth.js";
import { authRequired } from "../middlewares/authRequired.js";


const existeSancion = async(tipo)=> {
    const sancionExistente = await model.sancion.findOne({ where: {tipo}});
    return sancionExistente !== null;
}

export const registrarSanciones = async(req, res)=>{
    const { tipo, token} = req.body;
    const operador = userFromToken(token);
    const id_linea = idLineaFromToken(token);
    try{
        if(await existeSancion(tipo)){
            return res.status(400).json({ message: "El tipo de sanción ya existe"});
        }
        await model.sancion.create({tipo});
        registrarBitacora(
            operador,
            "CREACION",
            `Sanción tipo ${tipo} se ha creado con exito`,
            id_linea
        );
        res
      .status(201)
      .json({ message: "Sanción registrada con éxito", sancion: tipo });
    }catch(error){
        res.status(500).json({
            message: "Error al registrar la sancion",
            error: error.message,
          });
    }
}




export const registrarFichaSancion = async(req, res) => {
    const { chofer, token, monto, estado, descripcion, tipo} = req.body;
    const fecha = getToday();
    const hora = getNow();
    const ficha =  uuid();
    try{
        const id_linea = idLineaFromToken(token);
        const operador = userFromToken(token);
        const sancion = await model.sancion.findOne({
            where: {tipo}
        })

        const fichaRegistrada = await model.fichaSancion.create({
            id_ficha: ficha,
            fecha,
            hora,
            monto,
            estado,
            descripcion,
            usuario_chofer: chofer,
            usuario_operador: operador,
            id_sancion: sancion.dataValues.id_sancion
        });
        registrarBitacora(
            operador,
            "CREACION",
            `Se le ha asignado una sanción al chofer ${chofer}`,
            id_linea
        )
        res.status(201).json({
            message: "Ficha de Sanción registrada con éxito", Ficha: fichaRegistrada
          });

    }catch(error){
        res
        .status(500)
        .json({ message: "Error al registrar la ficha de sanción", error: error.message });
    }
}

export const getSanciones = async ( req, res) => {
    try{
        const sanciones = await model.sancion.findAll();
        if(!sanciones.length){
            return res.status(404).json({message: "No se encontraron sanciones"});
        }
        let listaDeSanciones = [];
        for (const sancion of sanciones) {
            const sancionInfo = {
                id: sancion.id_sancion,
                tipo: sancion.tipo
            };
            listaDeSanciones.push(sancionInfo);
        }
        res.status(200).json(listaDeSanciones);
    }catch(error){
        res.status(500).json({
            message: "Error al obtener las sanciones", error: error.message
          })
    }
}

export const getFichaSancionPorLinea = async ( req, res) =>{
    const { token} = req.body;
    const user = userFromToken(token);
    try{
        const  operador = await model.operadores.findByPk(user);
        const fichas = await model.fichaSancion.findAll({
         include: [
            {
                model: model.choferes,
                required: true,
                attributes:[],
                include:[
                    {
                        model: model.turno,
                        required: true,
                        attributes:[],
                        include: [
                            {
                                model: model.micro,
                                required: true,
                                attributes:[],
                                include: [
                                    {
                                        model: model.linea,
                                        required: true,
                                        where: {  id_linea: operador.id_linea}
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
         ]   
        })
        if(!fichas.length){
            return res.status(404).json({ message: "No se encontraron fichas de sancion "})
        }
        res.status(200).json(fichas);
        
    }catch(error){
        res.status(500).json({
            message: "Error al obtener las fichas de sancion de los micros", error: error.message,
        })
    }
}


export const getFichaSancionChofer = async (req, res) => {
    const { token , chofer} = req.body;
    const user = userFromToken(token);
    try{
        const operador = await model.operadores.findByPk(user);
        const fichas = await model.fichaSancion.findAll({
            include:[
                {
                    model: model.choferes,
                    required: true,
                    where:{usuario_chofer: chofer},
                    attributes:[],
                    include:[
                        {
                            model: model.turno,
                            required: true,
                            attributes:[],
                            include: [
                                {
                                    model: model.micro,
                                    required: true,
                                    attributes:[],
                                    include: [
                                        {
                                            model: model.linea,
                                            required: true,
                                            where: {  id_linea: operador.id_linea}
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }

            ]
        })
        if(!fichas.length){
            return res.status(404).json({ message: "No se encontraron fichas de sancion "})
        }
        res.status(200).json(fichas);
    }catch(error){
        res.status(500).json({
            message: "Error al obtener las fichas de sancion del chofer", error: error.message,
        })
    }
}

export const actualizarEstadoFicha = async(req, res) => {
    const {token, estado, ficha} = req.body;
    const operador = userFromToken(token);
    const id_linea = idLineaFromToken(token);
    const datos = {
        ...(estado && { estado})
    };
    try{
        
        await model.fichaSancion.update(datos, { 
            where: {
                id_ficha: ficha
            }
        })
        registrarBitacora(
            operador, 
            "ACTUALIZACION",
            `La ficha ${ficha} ha sido actualizada`,
            id_linea
        )
        res.status(201).json({
            datos: {
              estado: estado
            },
            message: "Ficha actualizada con exito ",
          });
    }catch(error){
        res
      .status(500)
      .json({ message: "Error al actualizar ficha", error: error.message })
    }
}




/*
export const eliminarSancion = async (req, res) => 
{
    const {token, id_sancion} = req.body;
    const operador = userFromToken(token);
    const id_linea = idLineaFromToken(token);
    try{

        await model.sancion.destroy({where: { id_sancion}});
        registrarBitacora(
            operador,
            "ELIMINACION",
            `Sanción ${sancion} ha sido destruida`,
            id_linea
        )
        res.status(200).json({ message: "Sanción eliminada con éxito" });
    }catch(error){
        res
      .status(500)
      .json({ message: "Error al eliminar la sanción", error: error.message });
    }
}*/