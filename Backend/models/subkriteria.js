import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Subkriteria = sequelize.define(
  'Subkriteria',
  {
    id_subkriteria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_kriteria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'kriteria',
        key: 'id_kriteria',
      },
    },
    nama_subkriteria: { type: DataTypes.STRING, allowNull: false },
    nilai: { type: DataTypes.FLOAT, allowNull: false }, // nilai konversi
  },
  {
    tableName: 'subkriteria',
    timestamps: true,
  }
);

export default Subkriteria;
