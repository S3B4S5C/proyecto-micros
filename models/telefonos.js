const telefonosModelo = (sequelize, DataTypes) => {
const telefono= sequelize.define(
  'telefonos',
  {
    // Model attributes are defined here
    id_telefono: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    id_informacion: {
       type: DataTypes.UUID,
       allowNull: false, 
       references: {
        model: 'informaciones_personales',
        key: 'id_informacion'
       }
    }
  },
  {
    tableName: 'telefonos',
    timestamps: false
  },
);
return telefono
}
export default telefonosModelo