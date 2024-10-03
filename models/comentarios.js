const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Comentario= sequelize.define(
  'Comentario',
  {
    // Model attributes are defined here
    id_comentario: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }, 
    fecha: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    hora: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    tipo_comentario: {
        type: DataTypes.STRING(64),
        allowNull:false
    },    
    usuario: {
        type: DataTypes.STRING(255),
        allowNull:false,
        references: {
            model: 'usuarios',
            key: 'id_linea'
        }
    },
    id_linea: {
        type: DataTypes.BIGINT,
        allowNull:false,
        references: {
            model: 'lineas',
            key: 'id_linea'
        }
    },
  },
  {
    tableName: 'comentarios',
    timestamps: false
  },
);

module.exports = Comentario;