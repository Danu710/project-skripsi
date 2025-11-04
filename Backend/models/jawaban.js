// models/jawaban.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Jawaban = sequelize.define(
  'Jawaban',
  {
    id_jawaban: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_siswa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'siswa', key: 'id_siswa' },
      onDelete: 'CASCADE',
    },
    id_soal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'soal', key: 'id_soal' },
      onDelete: 'CASCADE',
    },
    id_ujian: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'ujian', key: 'id_ujian' },
      onDelete: 'CASCADE',
    },
    jawaban_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_benar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'jawaban',
    timestamps: true,
  }
);

export default Jawaban;
