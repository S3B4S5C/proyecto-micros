import { Sequelize, DataTypes } from "sequelize";
import usuariosModelo from "./usuarios.js";
import informacionModelo from "./informaciones_personales.js";
import turnoModelo from "./turno.js";
import coordenadasModelo from "./coordenadas.js";
import dueñosModelo from "./dueños.js";
import estadosModelo from "./estados.js";
import fichasSancionesModelo from "./fichas_sanciones.js";
import horariosModelo from "./horarios.js";
import incidentesModelo from "./incidentes.js";
import lineasModelo from "./lineas.js";
import mantenimientosModelo from "./mantenimientos.js";
import mensajesModelo from "./mensajes.js";
import microsModelo from "./micros.js";
import notificacionesModelo from "./notificaciones.js";
import paradasProvisionalesModelo from "./paradas_provisionales.js";
import paradasModelo from "./paradas.js";
import revisionesTecnicasModelo from "./revisiones_tecnicas.js";
import rutasModelo from "./rutas.js";
import sancionesModelo from "./sanciones.js";
import sindicatosModelo from "./sindicatos.js";
import telefonosModelo from "./telefonos.js";
import trabajanModelo from "./trabajan.js";
import dotenv from "dotenv";
import choferesModelo from "./choferes.js";
import operadoresModelo from "./operadores.js";
import comentariosModelo from "./comentarios.js";
import bitacorasModelo from "./bitacoras.js";

dotenv.config();

const dbURI = process.env.DB_URI;
const sequelize = new Sequelize(dbURI);

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
  paradaProvisional: paradasProvisionalesModelo(sequelize, DataTypes),
  parada: paradasModelo(sequelize, DataTypes),
  revisionTecnica: revisionesTecnicasModelo(sequelize, DataTypes),
  ruta: rutasModelo(sequelize, DataTypes),
  sancion: sancionesModelo(sequelize, DataTypes),
  sindicato: sindicatosModelo(sequelize, DataTypes),
  telefono: telefonosModelo(sequelize, DataTypes),
  trabajan: trabajanModelo(sequelize, DataTypes),
  choferes: choferesModelo(sequelize, DataTypes),
  operadores: operadoresModelo(sequelize, DataTypes),
  comentario: comentariosModelo(sequelize, DataTypes),
  bitacora: bitacorasModelo(sequelize, DataTypes),
};

//El que tiene la llave foranea va con belongsTo
model.usuarios.hasOne(model.choferes, { foreignKey: "usuario_chofer" });
model.choferes.belongsTo(model.usuarios, { foreignKey: "usuario_chofer" });

model.usuarios.hasOne(model.operadores, { foreignKey: "usuario_operador" });
model.operadores.belongsTo(model.usuarios, { foreignKey: "usuario_operador" });

model.informacionesPersonales.hasOne(model.usuarios, {
  foreignKey: "id_informacion",
});
model.usuarios.belongsTo(model.informacionesPersonales, {
  foreignKey: "id_informacion",
});

model.informacionesPersonales.hasMany(model.telefono, {
  foreignKey: "id_informacion",
});
model.telefono.belongsTo(model.informacionesPersonales, {
  foreignKey: "id_informacion",
});

model.informacionesPersonales.hasOne(model.dueño, {
  foreignKey: "id_informacion",
});
model.dueño.belongsTo(model.informacionesPersonales, {
  foreignKey: "id_informacion",
});

model.dueño.hasMany(model.micro, { foreignKey: "id_dueño" });
model.micro.belongsTo(model.dueño, { foreignKey: "id_dueño" });

model.micro.hasMany(model.revisionTecnica, { foreignKey: "id_micro" });
model.revisionTecnica.belongsTo(model.micro, { foreignKey: "id_micro" });

model.micro.hasMany(model.estado, { foreignKey: "id_micro" });
model.estado.belongsTo(model.micro, { foreignKey: "id_micro" });

model.micro.belongsToMany(model.choferes, {
  through: model.turno,
  foreignKey: "id_micro",
});
model.choferes.belongsToMany(model.micro, {
  through: model.turno,
  foreignKey: "usuario_chofer",
});

model.turno.hasOne(model.incidente, {
  foreignKey: ["usuario_chofer", "id_micro"],
});
model.incidente.belongsTo(model.turno, {
  foreignKey: ["usuario_chofer", "id_micro"],
});

model.horario.hasOne(model.turno, { foreignKey: "id_horario" });
model.turno.belongsTo(model.horario, { foreignKey: "id_horario" });

model.operadores.hasMany(model.incidente, { foreignKey: "usuario_operador" });
model.incidente.belongsTo(model.operadores, { foreignKey: "usuario_operador" });

model.operadores.hasMany(model.fichaSancion, {
  foreignKey: "usuario_operador",
});
model.fichaSancion.belongsTo(model.operadores, {
  foreignKey: "usuario_operador",
});

model.choferes.hasMany(model.fichaSancion, { foreignKey: "usuario_chofer" });
model.fichaSancion.belongsTo(model.choferes, { foreignKey: "usuario_chofer" });

model.sancion.hasMany(model.fichaSancion, { foreignKey: "id_sancion" });
model.fichaSancion.belongsTo(model.sancion, { foreignKey: "id_sancion" });

model.operadores.hasMany(model.notificacion, {
  foreignKey: "usuario_operador",
});
model.notificacion.belongsTo(model.operadores, {
  foreignKey: "usuario_operador",
});

model.usuarios.hasMany(model.comentario, {
  foreignKey: "usuario",
  as: "usuario_comentario",
});
model.comentario.belongsTo(model.usuarios, {
  foreignKey: "usuario",
  as: "usuario_comentario",
});

model.linea.hasMany(model.comentario, { foreignKey: "id_linea" });
model.comentario.belongsTo(model.linea, { foreignKey: "id_linea" });

model.sindicato.hasMany(model.linea, { foreignKey: "id_sindicato" });
model.linea.belongsTo(model.sindicato, { foreignKey: "id_sindicato" });

model.micro.belongsToMany(model.linea, {
  through: model.trabajan,
  foreignKey: "id_micro",
});
model.linea.belongsToMany(model.micro, {
  through: model.trabajan,
  foreignKey: "id_linea",
});

model.micro.hasMany(model.mantenimiento, { foreignKey: "id_micro" });
model.mantenimiento.belongsTo(model.micro, { foreignKey: "id_micro" });

model.linea.hasMany(model.ruta, { foreignKey: "id_linea" });
model.ruta.belongsTo(model.linea, { foreignKey: "id_linea" });

model.ruta.hasMany(model.parada, { foreignKey: "id_ruta" });
model.parada.belongsTo(model.ruta, { foreignKey: "id_ruta" });

model.coordenada.hasMany(model.parada, { foreignKey: "id_coordenada" });
model.parada.belongsTo(model.coordenada, { foreignKey: "id_coordenada" });

model.coordenada.hasMany(model.paradaProvisional, {
  foreignKey: "id_coordenada",
});
model.paradaProvisional.belongsTo(model.coordenada, {
  foreignKey: "id_coordenada",
});

model.parada.hasMany(model.paradaProvisional, { foreignKey: "id_parada" });
model.paradaProvisional.belongsTo(model.parada, { foreignKey: "id_parada" });

model.paradaProvisional.hasMany(model.paradaProvisional, {
  foreignKey: "id_parada_provisional",
  as: "subParadasProvisionales",
});

model.paradaProvisional.belongsTo(model.paradaProvisional, {
  foreignKey: "id_parada_provisional",
  as: "paradaProvisionalPadre",
});

model.usuarios.hasMany(model.mensaje, {
  foreignKey: "usuario_emisor",
  as: "mensajesEnviados",
});
model.mensaje.belongsTo(model.usuarios, {
  foreignKey: "usuario_emisor",
  as: "emisor",
});

model.usuarios.hasMany(model.mensaje, {
  foreignKey: "usuario_receptor",
  as: "mensajesRecibidos",
});
model.mensaje.belongsTo(model.usuarios, {
  foreignKey: "usuario_receptor",
  as: "receptor",
});

model.usuarios.hasMany(model.bitacora, { foreignKey: "usuario_bitacora" });
model.bitacora.belongsTo(model.usuarios, { foreignKey: "usuario_bitacora" });

export default model;
