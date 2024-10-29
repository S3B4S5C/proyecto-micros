const incidentesModelo = (sequelize, DataTypes) => {
const incidente = sequelize.define(
  'incidentes',
  {
    // Model attributes are defined here
    id_incidente: {
      type: DataTypes.BIGINT,
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
    }
  },
  {
    tableName: 'incidentes',
    timestamps: false
  },
);
incidente.associate = function(models) {
  incidente.belongsTo(models.Turno, {
      foreignKey: ['usuario_chofer', 'id_micro'],
      targetKeyKey: ['usuario_chofer', 'id_micro'],
      as: 'turno',
  })
};
  return incidente
};

export default incidentesModelo