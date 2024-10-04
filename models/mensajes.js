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
    usuario_emisor: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'usuario'
        }
    },
    usuario_receptor: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'usuario'
        }
    },
  },
  {
    tableName: 'mensajes',
    timestamps: false
  },
);
  return mensaje
} 
export default mensajesModelo