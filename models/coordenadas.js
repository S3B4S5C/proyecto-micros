const coordenadasModelo = (sequelize, DataTypes) => {
const coordenada = sequelize.define(
  'coordenadas',
  {
    // Model attributes are defined here
    id_coordenada: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    coordenadas_lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    coordenadas_lon: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    }
  },
  {
    tableName: 'coordenadas',
    timestamps: false
  },
)
  return coordenada
};
export default coordenadasModelo
