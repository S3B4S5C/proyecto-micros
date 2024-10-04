const sancionesModelo = (sequelize, DataTypes) => {
const sancion = sequelize.define(
  'sanciones',
  {
    // Model attributes are defined here
    id_sancion: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    tableName: 'sanciones',
    timestamps: false
  },
);
  return sancion
}
export default sancionesModelo