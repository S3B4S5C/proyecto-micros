const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const ParadaProvisional = sequelize.define(
  'ParadaProvisional',
  {
    // Model attributes are defined here
    id_provisional: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'paradas_provisionales',
        key: 'id_provisional'
      },
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    id_linea: {
        type: DataTypes.BIGINT,
        allowNull:false,
        references: {
            model: 'coordenadas',
            key: 'id_coordenada'
        },
        onDelete:  'CASCADE',
    },
    id_parada: {
        type: DataTypes.BIGINT,
        references: {
            model: 'paradas',
            key: 'id_parada'
        },
    }
  },
  {
    tableName: 'paradas_provisionales',
    timestamps: false
  },
);

module.exports = ParadaProvisional;
