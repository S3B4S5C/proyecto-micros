const horariosModelo = (sequelize, DataTypes) => {
const horario = sequelize.define(
  'horarios',
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
)
  return horario
};
export default horariosModelo
