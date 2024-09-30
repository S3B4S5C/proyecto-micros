const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Trabajan= sequelize.define(
  'Trabajan',
  {
    // Model attributes are defined here
    id_lineas: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'lineas',
        key: 'id_linea'
      },
    },
    id_micro: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'micros',
            key: 'id_micro'
        },
    },
  },
  {
    tableName: 'trabajan',
    timestamps: false
  },
);

module.exports = Trabajan;