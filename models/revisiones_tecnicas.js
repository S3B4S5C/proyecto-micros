const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const RevisionTecnica = sequelize.define(
  'RevisionTecnica',
  {
    // Model attributes are defined here
    id_revision: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    detalle: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    fecha_revision: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    fecha_proxima_revision: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    id_micro: {
        type: DataTypes.BIGINT,
        allowNull:false,
        references: {
            model: 'micros',
            key: 'id_micro'
        }
    }
  },
  {
    tableName: 'revisiones_tecnicas',
    timestamps: false
  },
);

module.exports = RevisionTecnica;
