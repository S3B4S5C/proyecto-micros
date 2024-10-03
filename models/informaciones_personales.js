const informacionModelo = (sequelize, DataTypes) => {
  const informacionPersonal = sequelize.define(
    'informaciones_personales',
    {
      // Model attributes are defined here
      id_informacion: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      nombre: {
          type: DataTypes.STRING(255),
          allowNull: false,
      },
      apellido: {
          type: DataTypes.STRING(255),
          allowNull: false,
      }, 
      correo: {
          type: DataTypes.STRING(255),
          allowNull: false,
      },
      sexo: {
          type: DataTypes.STRING(32),
          allowNull:true
      },
      fecha_de_nacimiento: {
          type: DataTypes.DATEONLY,
          allowNull:true
      },
      direccion: {
          type: DataTypes.STRING(255),
          allowNull:true
      },
      carnet: {
          type: DataTypes.STRING(255),
          allowNull:true
      },
    },
    {
      tableName: 'informaciones_personales',
      timestamps: false
    },
  )
  return informacionPersonal
}

export default informacionModelo