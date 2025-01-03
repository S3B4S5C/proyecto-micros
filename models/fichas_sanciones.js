const fichasSancionesModelo = (sequelize, DataTypes) => {
const fichaSancion = sequelize.define(
  'fichas_sanciones',
  {
    // Model attributes are defined here
    id_ficha: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    monto: {
        type: DataTypes.BIGINT,
    },
    estado: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    usuario_chofer: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'choferes',
            key: 'usuario_chofer'
        },
    },
    usuario_operador: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: 'operadores',
            key: 'usuario_operador'
        },
    },
    id_sancion: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: {
            model: 'sanciones',
            key: 'id_sancion'
        },
    },
  },
  {
    tableName: 'fichas_sanciones',
    timestamps: false
  },
)
  return fichaSancion
};
export default fichasSancionesModelo