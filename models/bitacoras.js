const bitacorasModelo = (sequelize, DataTypes) => {
  const bitacora = sequelize.define(
    "bitacoras",
    {
      id_bitacora: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      usuario_bitacora: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "usuario",
        },
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      hora: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false
      },
      id_linea: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "lineas",
          key: "id_linea",
        },
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );
  return bitacora;
};

export default bitacorasModelo;
