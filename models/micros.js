const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Micro = sequelize.define(
  'Micro',
  {
    // Model attributes are defined here
    id_micro: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    placa: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    interno: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    modelo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    año: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    seguro: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    id_dueño: {
        type: DataTypes.BIGINT,
        allowNull: false, 
        references: {
         model: 'dueños',
         key: 'id_dueño'
        }
     }
  },
  {
    tableName: 'micros',
    timestamps: false
  },
);

module.exports = Micro;