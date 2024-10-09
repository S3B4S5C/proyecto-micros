import { Sequelize, DataTypes } from 'sequelize'
import usuariosModelo from './usuarios.js';
import informacionModelo from './informaciones_personales.js';
import turnoModelo from './turno.js';
import coordenadasModelo from './coordenadas.js';
import dueñosModelo from './dueños.js';
import estadosModelo from './estados.js';
import fichasSancionesModelo from './fichas_sanciones.js';
import horariosModelo from './horarios.js';
import incidentesModelo from './incidentes.js';
import lineasModelo from './lineas.js';
import mantenimientosModelo from './mantenimientos.js';
import mensajesModelo from './mensajes.js';
import microsModelo from './micros.js';
import notificacionesModelo from './notificaciones.js';
import paradasProvisionalesModelo from './paradas_provisionales.js';
import paradasModelo from './paradas.js';
import revisionesTecnicasModelo from './revisiones_tecnicas.js';
import rutasModelo from './rutas.js';
import sancionesModelo from './sanciones.js';
import sindicatosModelo from './sindicatos.js';
import telefonosModelo from './telefonos.js';
import trabajanModelo from './trabajan.js';
import dotenv from 'dotenv';
import choferesModelo from './choferes.js';
import operadoresModelo from './operadores.js';

dotenv.config()

const dbURI = process.env.DB_URI
const sequelize = new Sequelize(dbURI)

const model = {
    usuarios: usuariosModelo(sequelize, DataTypes),
    informacionesPersonales: informacionModelo(sequelize, DataTypes),
    turno: turnoModelo(sequelize, DataTypes),
    coordenada: coordenadasModelo(sequelize, DataTypes),
    dueño: dueñosModelo(sequelize, DataTypes),
    estado: estadosModelo(sequelize, DataTypes),
    fichaSancion: fichasSancionesModelo(sequelize, DataTypes),
    horario: horariosModelo(sequelize, DataTypes),
    incidente: incidentesModelo(sequelize, DataTypes),
    linea: lineasModelo(sequelize, DataTypes),
    mantenimiento: mantenimientosModelo(sequelize, DataTypes),
    mensaje: mensajesModelo(sequelize, DataTypes),
    micro: microsModelo(sequelize, DataTypes),
    notificacion: notificacionesModelo(sequelize, DataTypes),
    paradaProvisional: paradasProvisionalesModelo(sequelize,DataTypes),
    parada: paradasModelo(sequelize, DataTypes),
    revisionTecnica: revisionesTecnicasModelo(sequelize, DataTypes),
    ruta: rutasModelo(sequelize, DataTypes),
    sancion: sancionesModelo(sequelize,DataTypes),
    sindicato: sindicatosModelo(sequelize, DataTypes),
    telefono: telefonosModelo(sequelize, DataTypes),
    trabajan: trabajanModelo(sequelize, DataTypes),
    choferes: choferesModelo(sequelize, DataTypes),
    operadores: operadoresModelo(sequelize, DataTypes)
}

//El que tiene la llave foranea va con belongsTo
model.usuarios.hasOne(model.choferes, { foreignKey: 'usuario_chofer' })
model.choferes.belongsTo(model.usuarios, { foreignKey: 'usuario_chofer' })

model.informacionesPersonales.hasOne(model.usuarios, { foreignKey: 'id_informacion'})
model.usuarios.belongsTo(model.informacionesPersonales, { foreignKey: 'id_informacion'})

model.informacionesPersonales.hasMany(model.telefono, { foreignKey: 'id_informacion'})
model.telefono.belongsTo(model.informacionesPersonales, { foreignKey: 'id_informacion'})

export default model