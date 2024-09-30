const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Horario = sequelize.define(
  'Horario',
  {
    // Model attributes are defined here
    id_horario: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
   hora_salida: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_llegada: {
      type: DataTypes.TIME,
      allowNull: true
    },
    punto_de_salida: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    fecha_horario: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: true
    },
    usuario_operador: {
        type: DataTypes.STRING(255),
        allowNull:false,
        references: {
            model: 'operadores',
            key: 'usuario_operador'
        }
    }
  },
  {
    tableName: 'horarios',
    timestamps: false
  },
);

module.exports = Horario;
