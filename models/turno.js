const turnoModelo = (sequelize, DataTypes) => {
  const turno = sequelize.define(
    "turno",
    {
      id_turno: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      usuario_chofer: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: "choferes",
          key: "usuario_chofer",
        },
      },
      id_horario: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "horarios",
          key: "id_horario",
        },
      },
      id_micro: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "micros",
          key: "id_micro",
        },
      },
    },
    {
      tableName: "turno",
      timestamps: false,
    },
  );
  return turno;
};

export default turnoModelo;
