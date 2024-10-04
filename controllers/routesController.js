import model from '../models/index.js'
import paradasModelo from '../models/paradas.js';
import paradasProvisionalesModelo from '../models/paradas_provisionales.js';

const existeSindicato = async (sindicato) => {
    const SindicatoExistente = await model.sindicato.findOne( { where: { nombre: sindicato }});
    return SindicatoExistente !== null;
}
const existeLinea= async (linea) => {
    const lineaExistente = await model.linea.findOne( { where: { nombre: linea }});
    return lineaExistente !== null;
}

export const registrarSindicato = async (req, res) => {
    const { nombre } = req.body;
    try{
        if (await existeSindicato(nombre)){
            return res.status(400).json({ message: 'El nombre de sindicato ya está en uso' })
        }
        await model.sindicato.create({nombre});
        res.status(201).json({ message: 'Sindicato registrado con éxito', user: nombre });
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
        await model.linea.create({nombre, id_sindicato: sindicato});
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

export const crearCoordenada = async (req, res) => {
    const { latitud, longitud } = req.body;
    try{
        const coordenadaNueva = await model.coordenada.create({ coordenadas_lat: latitud, coordenadas_lon: longitud})
        res.status(201).json({ message: 'Coordenada registrada con éxito', user: coordenadaNueva });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la coordenada', error: error.message });
    }
}

export const crearParada = async (req, res) => {
    const { nombre, orden , ruta, coordenada } = req.body;
    try{
        const paradaNueva = await model.parada.create({ nombre_parada: nombre, orden_parada: orden, id_ruta: ruta, id_coordenada: coordenada});
        res.status(201).json({ message: 'Parada registrada con éxito', user: paradaNueva });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la parada', error: error.message });
    }
}

export const crearParadaProvisional = async (req, res) => {
    const { fecha_inicio, fecha_fin, coordenada, parada } = req.body;
    try{
        const paradaProvisionalNueva = await model.paradaProvisional.create({ fecha_inicio, fecha_fin, id_parada: parada, id_coordenada: coordenada});
        res.status(201).json({ message: 'Parada provisional registrada con éxito', user: paradaProvisionalNueva });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la parada provisional', error: error.message });
    }
}

export const deshabilitarParadaProvisional = async (req, res) => {
    const { id } = req.params;
    const { fecha_fin } = req.body;
    try{
        const paradaProvisional = await model.paradaProvisional.findByPf(id);
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
        const parada = await model.parada.findByPK(id);
        if (!parada){
            return res.status(404).json({ message: 'Parada  no encontrada' });
        }
        await model.parada.destroy();
        res.status(200).json({ message: "Parada eliminada con éxito" });
    } catch (error){
        res.status(500).json({ message: "Error al eliminar la parada", error: error.message });
    }
}
