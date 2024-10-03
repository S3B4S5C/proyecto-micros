import { Sequelize, DataTypes } from 'sequelize'
import usuariosModelo from './usuarios.js';
import informacionModelo from './informaciones_personales.js';
import turnoModelo from './turno.js';
import dotenv from 'dotenv';

dotenv.config()

const dbURI = process.env.DB_URI
const sequelize = new Sequelize(dbURI)

const model = {
    usuarios: usuariosModelo(sequelize, DataTypes),
    informacionesPersonales: informacionModelo(sequelize, DataTypes),
    turno: turnoModelo(sequelize, DataTypes)
}

export default model