const paradasModelo = (sequelize, DataTypes) => {
const parada= sequelize.define(
  'paradas',
  {
    // Model attributes are defined here
    id_parada: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    nombre_parada: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    orden_parada: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    },
    id_ruta: {
        type: DataTypes.BIGINT,
        allowNull:false,
        references: {
            model: 'rutas',
            key: 'id_ruta'
        }
    },
    id_coordenada: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'coordenadas',
            key: 'id_coordenada'
        },
        onDelete: 'CASCADE'
    } 
  },
  {
    tableName: 'paradas',
    timestamps: false
  },
);
  return parada
}
export default paradasModelo