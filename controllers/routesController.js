import { uuid } from 'uuidv4';
import model from '../models/index.js'

const existeSindicato = async (sindicato) => {
    const SindicatoExistente = await model.sindicato.findOne( { where: { nombre: sindicato }});
    return SindicatoExistente !== null;
}

const existeLinea = async (linea) => {
    const lineaExistente = await model.linea.findOne( { where: { nombre_linea: linea }});
    return lineaExistente !== null;
}

const crearCoordenada = async (uuid, latitud, longitud) => {
    await model.coordenada.create({ id_coordenada: uuid, coordenadas_lat: latitud, coordenadas_lon: longitud})
}

const eliminarCoordenada = async (uuid) => {
    await model.coordenada.destroy({ where : {id_coordenada: uuid} })
}

export const registrarSindicato = async (req, res) => {
    const { nombre } = req.body;
    try{
        if (await existeSindicato(nombre)){
            return res.status(400).json({ message: 'El nombre de sindicato ya está en uso' })
        }
        await model.sindicato.create({nombre});
        res.status(201).json({ message: 'Sindicato registrado con éxito', sindicato: nombre });
    } catch(error){
        res.status(500).json({ message: 'Error al registrar el sindicato', error: error.message });
    }
}

export const registrarLinea = async (req, res) => {
    const { nombre , sindicato} = req.body;
    try{
        if (await existeLinea(nombre)){
            return res.status(400).json({ message: 'El nombre de la linea ya está en uso' })
        }
        await model.linea.create({nombre_linea: nombre, id_sindicato: sindicato});
        res.status(201).json({ message: 'Linea registrada con éxito', user: nombre });
    } catch(error){
        res.status(500).json({ message: 'Error al registrar la linea', error: error.message });
    }
}

export const crearRuta = async (req, res) => {
    const { linea } = req.body;
    try{
        const rutaNueva = await model.ruta.create({ id_linea: linea});
        res.status(201).json({ message: 'Ruta registrada con éxito', user: rutaNueva });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la ruta', error: error.message });
    }
}

export const crearParada = async (req, res) => {
    const { nombre, orden , ruta, latitud, longitud } = req.body
    const id_parada = uuid()
    const coordenada = uuid()
    try{
        await crearCoordenada(coordenada, latitud, longitud)
        const paradaNueva = await model.parada.create({ id_parada, nombre_parada: nombre, orden_parada: orden, id_ruta: ruta, id_coordenada: coordenada});
        res.status(201).json({ message: 'Parada registrada con éxito', parada: paradaNueva });
    } catch (error) {
        await eliminarCoordenada(coordenada)
        res.status(500).json({ message: 'Error al registrar la parada', error: error.message });
    }
}

export const crearParadaProvisional = async (req, res) => {
    const { fecha_inicio, fecha_fin, parada, latitud, longitud, id_parada_provisional } = req.body;
    const id_provisional = uuid()
    const coordenada = uuid()
    try{
        await crearCoordenada(coordenada, latitud, longitud)
        const paradaProvisionalNueva = await model.paradaProvisional.create(
            { 
                id_provisional, 
                fecha_inicio, 
                fecha_fin, 
                id_parada: parada, 
                id_coordenada: coordenada, 
                id_parada_provisional
            })
        res.status(201).json({ message: 'Parada provisional registrada con éxito', parada: paradaProvisionalNueva });
    } catch (error) {
        await eliminarCoordenada(coordenada)
        res.status(500).json({ message: 'Error al registrar la parada provisional', error: error.message });
    }
}

export const deshabilitarParadaProvisional = async (req, res) => {
    const { id } = req.params;
    const fecha_fin = Date.now();
    console.log(fecha_fin)
    try{
        const paradaProvisional = await model.paradaProvisional.findByPk(id);
        if (!paradaProvisional) {
            return res.status(404).json({ message: 'Parada provisional no encontrada' });
        }
        paradaProvisional.fecha_fin = fecha_fin;
        await paradaProvisional.save();
        res.status(200).json({ message: 'Parada provisional deshabilitada con éxito', paradaProvisional });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la parada provisional', error: error.message });
    }
}

export const eliminarParada = async (req, res) => {
    const { id }= req.params;
    try{
        const parada = await model.parada.findByPk(id);
        if (!parada){
            return res.status(404).json({ message: 'Parada  no encontrada' });
        }
        const coordenada = await model.coordenada.findByPk(parada.id_coordenada)
        await parada.destroy();
        if (coordenada) {
        await coordenada.destroy({});
        }
        res.status(200).json({ message: "Parada eliminada con éxito" });
    } catch (error){
        res.status(500).json({ message: "Error al eliminar la parada", error: error.message });
    }
}
