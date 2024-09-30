const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Turno= sequelize.define(
  'Turno',
  {
    // Model attributes are defined here
    usuario_chofer: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'choferes',
            key: 'usuario_chofer'
        },
    },
    id_horario: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'horarios',
        key: 'id_horario'
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
    tableName: 'turno',
    timestamps: false
  },
);

module.exports = Turno;