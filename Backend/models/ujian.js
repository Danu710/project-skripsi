// models/ujian.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Ujian = sequelize.define(
  'Ujian',
  {
    id_ujian: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_ujian: { type: DataTypes.STRING, allowNull: false },
    tanggal_ujian: { type: DataTypes.DATE },
    durasi: { type: DataTypes.INTEGER },
    id_guru: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'guru', // nama tabel Guru di database
        key: 'id_guru',
      },
    },
  },
  {
    tableName: 'ujian',
    timestamps: true,
  }
);

export default Ujian;
