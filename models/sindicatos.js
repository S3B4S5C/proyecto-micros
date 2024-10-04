const sindicatosModelo = (sequelize, DataTypes) => {
const sindicato= sequelize.define(
  'sindicatos',
  {
    // Model attributes are defined here
    id_sindicato: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  },
  {
    tableName: 'sindicatos',
    timestamps: false
  },
);
return sindicato
}
export default sindicatosModelo