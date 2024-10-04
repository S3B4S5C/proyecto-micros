const rutasModelo = (sequelize, DataTypes) => {
const ruta = sequelize.define(
  'rutas',
  {
    // Model attributes are defined here
    id_ruta: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    longitud_total: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    duracion_estimada: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_linea: {
        type: DataTypes.BIGINT,
        allowNull:false,
        references: {
            model: 'lineas',
            key: 'id_linea'
        }
    }
  },
  {
    tableName: 'rutas',
    timestamps: false
  },
);
  return ruta
}
export default rutasModelo