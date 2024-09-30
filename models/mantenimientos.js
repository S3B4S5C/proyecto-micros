const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Mantenimiento = sequelize.define(
  'Mantenimiento',
  {
    // Model attributes are defined here
    id_mantenimiento: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    id_micro: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'micros',
            key: 'id_micro'
        }
    },
  },
  {
    tableName: 'mantenimientos',
    timestamps: false
  },
);

module.exports = Mantenimiento;