const dueñosModelo = (sequelize, DataTypes) => {
const dueño = sequelize.define(
  'dueños',
  {
    // Model attributes are defined here
    id_dueño: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    id_informacion: {
        type: DataTypes.UUID,
        allowNull: false, 
        references: {
         model: 'InformacionesPersonales',
         key: 'id_informacion'
        }
     }
  },
  {
    tableName: 'dueños',
    timestamps: false
  },
)
  return dueño
};
export default dueñosModelo
