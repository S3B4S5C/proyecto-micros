const estadosModelo = (sequelize, DataTypes) => {
const estado = sequelize.define(
  'estados',
  {
    // Model attributes are defined here
    id_estado: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    estado: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    hora: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    id_micro: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'micros',
            key: 'id_micro'
        }
    },
  },
  {
    tableName: 'estados',
    timestamps: false
  },
)
return estado
};

export default estadosModelo
