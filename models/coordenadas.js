const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Coordenada = sequelize.define(
  'Coordenada',
  {
    // Model attributes are defined here
    id_coordenada: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    coordenadas_lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    coordenadas_lon: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    }
  },
  {
    tableName: 'coordenadas',
    timestamps: false
  },
);

module.exports = Coordenada;