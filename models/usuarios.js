
const usuariosModelo = (sequelize, DataTypes)=> {
  const usuario = sequelize.define(
    'usuarios',
    {
      usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      id_informacion: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'id_informacion',
        references: {
          model: 'informaciones_personales',
          key: 'id_informacion'
        }
      }
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  )
  return usuario
}

export default usuariosModelo
