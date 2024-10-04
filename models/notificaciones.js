const notificacionesModelo = (sequelize, DataTypes) => {
const notificacion = sequelize.define(
  'notificaciones',
  {
    // Model attributes are defined here
    id_notificacion: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    contenido: {
        type: DataTypes.STRING(255),
        allowNull: false
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
    tableName: 'notificaciones',
    timestamps: false
  },
);
   return notificacion
}
export default notificacionesModelo