
const choferesModelo = (sequelize, DataTypes)=> {
    const chofer = sequelize.define(
      'choferes',
      {
        usuario_chofer: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'usuarios',
            key: 'usuario'
          }
        },
        licencia_categoria: {
            type: DataTypes.STRING(32),
            allowNull: false
        }
    },
      {
        freezeTableName: true,
        timestamps: false
      }
    )
    return chofer
  }
  
  export default choferesModelo
  