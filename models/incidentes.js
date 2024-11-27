const incidentesModelo = (sequelize, DataTypes) => {
const incidente = sequelize.define(
  'incidentes',
  {
    // Model attributes are defined here
    id_incidente: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
   hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    id_turno: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "turno",
        key: "id_turno",
      },
    },
    id_linea: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'lineas',
        key: 'id_linea'
      }
    }
  },
  {
    tableName: 'incidentes',
    timestamps: false
  },
);

  return incidente
};

export default incidentesModelo