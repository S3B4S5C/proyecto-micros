const mensajesModelo = (sequelize, DataTypes) => {
const mensaje = sequelize.define(
  'mensajes',
  {
    // Model attributes are defined here
    id_mensaje: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    contenido: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    emisor: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'usuario'
        }
    },
    id_linea: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'lineas',
        key: 'id_linea'
      }
    },
    fecha: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
    }
  },
  {
    tableName: 'mensajes',
    timestamps: false
  },
);
  return mensaje
} 
export default mensajesModelo