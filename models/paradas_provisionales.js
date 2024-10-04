import { defaultValueSchemable } from "sequelize/lib/utils";

const paradasProvisionalesModelo = (sequelize, DataTypes) => {
const paradaProvisional = sequelize.define(
  'paradas_provisionales',
  {
    // Model attributes are defined here
    id_provisional: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    id_coordenada: {
        type: DataTypes.BIGINT,
        allowNull:false,
        references: {
            model: 'coordenadas',
            key: 'id_coordenada'
        },
        onDelete:  'CASCADE',
    },
    id_parada: {
        type: DataTypes.BIGINT,
        references: {
            model: 'paradas',
            key: 'id_parada'
        },
    },
    id_parada_provisional: {
      type: DataTypes.BIGINT,
      references: {
        model: 'paradas_provisionales',
        key: 'id_provisional'
      }
    }
  },
  {
    tableName: 'paradas_provisionales',
    timestamps: false
  },
);
  return paradaProvisional
}
export default paradasProvisionalesModelo
