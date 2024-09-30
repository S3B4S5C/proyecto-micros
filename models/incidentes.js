const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Incidente = sequelize.define(
  'Incidente',
  {
    // Model attributes are defined here
    id_incidente: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
   hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    usuario_chofer: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    id_micro: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
  },
  {
    tableName: 'incidentes',
    timestamps: false
  },
);
Incidente.associate = function(models) {
    Incidente.belongsTo(models.Turno, {
        foreignKey: ['usuario_chofer', 'id_micro'],
        targetKeyKey: ['usuario_chofer', 'id_micro'],
        as: 'turno',
    })
};
module.exports = Incidente;