const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Sindicato= sequelize.define(
  'Sindicato',
  {
    // Model attributes are defined here
    id_sindicato: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  },
  {
    tableName: 'sindicatos',
    timestamps: false
  },
);

module.exports = Sindicato;