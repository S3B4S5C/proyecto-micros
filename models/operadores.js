
const operadoresModelo = (sequelize, DataTypes)=> {
    const operador = sequelize.define(
      'operadores',
      {
        usuario_operador: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'usuarios',
            key: 'usuario'
          }
        },
        id_linea: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'lineas',
            key: 'id_linea'
          }
        }
    },
      {
        freezeTableName: true,
        timestamps: false
      }
    )
    return operador
  }
  
  export default operadoresModelo
  