const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Dueño = sequelize.define(
  'Dueño',
  {
    // Model attributes are defined here
    id_dueño: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    id_informacion: {
        type: DataTypes.UUID,
        allowNull: false, 
        references: {
         model: 'InformacionesPersonales',
         key: 'id_informacion'
        }
     }
  },
  {
    tableName: 'dueños',
    timestamps: false
  },
);

module.exports = Dueño;
