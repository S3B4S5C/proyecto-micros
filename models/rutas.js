const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Ruta = sequelize.define(
  'Ruta',
  {
    // Model attributes are defined here
    id_ruta: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    longitud_total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    duracion_estimada: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_linea: {
        type: DataTypes.BIGINT,
        allowNull:false,
        references: {
            model: 'lineas',
            key: 'id_linea'
        }
    }
  },
  {
    tableName: 'rutas',
    timestamps: false
  },
);

module.exports = Ruta;
