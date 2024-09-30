const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Linea= sequelize.define(
  'Linea',
  {
    // Model attributes are defined here
    id_linea: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre_linea: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    id_sindicato: {
       type: DataTypes.BIGINT,
       allowNull: false, 
       references: {
        model: 'sindicatos',
        key: 'id_sindicato'
       }
    }
  },
  {
    tableName: 'lineas',
    timestamps: false
  },
);

module.exports = Linea;