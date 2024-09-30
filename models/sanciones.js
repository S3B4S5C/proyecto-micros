const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Sancion = sequelize.define(
  'Sancion',
  {
    // Model attributes are defined here
    id_sancion: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    tableName: 'sanciones',
    timestamps: false
  },
);

module.exports = Sancion;