// models/nilai.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Nilai = sequelize.define(
  'Nilai',
  {
    id_nilai: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_siswa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_ujian: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_nilai: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ranking: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'nilai',
    timestamps: true,
  }
);

export default Nilai;
