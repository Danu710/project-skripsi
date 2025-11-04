// models/materi.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Materi = sequelize.define(
  'Materi',
  {
    id_materi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    judul_materi: { type: DataTypes.STRING, allowNull: false },
    deskripsi: { type: DataTypes.TEXT },
    file_materi: { type: DataTypes.STRING }, // path atau url file
    id_guru: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'guru', // nama tabel Guru di database
        key: 'id_guru',
      },
    },
  },
  {
    tableName: 'materi',
    timestamps: true,
  }
);

export default Materi;
