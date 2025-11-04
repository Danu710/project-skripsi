// models/guru.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Guru = sequelize.define(
  'Guru',
  {
    id_guru: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama_guru: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    mata_pelajaran: { type: DataTypes.STRING },
  },
  {
    tableName: 'guru',
    timestamps: true,
  }
);

export default Guru;
