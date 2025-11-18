import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Kriteria = sequelize.define(
  'Kriteria',
  {
    id_kriteria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kode: { type: DataTypes.STRING, allowNull: false }, // contoh: C1
    nama_kriteria: { type: DataTypes.STRING, allowNull: false },
    tipe: { type: DataTypes.ENUM('benefit', 'cost'), allowNull: false },
    bobot: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    tableName: 'kriteria',
    timestamps: true,
  }
);

export default Kriteria;
