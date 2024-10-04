const trabajanModelo = (sequelize, DataTypes) => {
const trabajan= sequelize.define(
  'trabajan',
  {
    // Model attributes are defined here
    id_lineas: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'lineas',
        key: 'id_linea'
      },
    },
    id_micro: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'micros',
            key: 'id_micro'
        },
    },
  },
  {
    tableName: 'trabajan',
    timestamps: false
  },
);
return trabajan
}
export default trabajanModelo