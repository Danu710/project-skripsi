// models/siswa.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Siswa = sequelize.define(
  'Siswa',
  {
    id_siswa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_siswa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kelas: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jurusan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sedang_ujian: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    id_ujian_aktif: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'siswa',
    timestamps: true,
  }
);

export default Siswa;
