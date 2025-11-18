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
      onUpdate: 'CASCADE',
    },

    id_soal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'soal', key: 'id_soal' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    id_ujian: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'ujian', key: 'id_ujian' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    jawaban_text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['A', 'B', 'C', 'D']], // opsional → MCQ only
      },
    },
  },
  {
    tableName: 'jawaban',
    timestamps: false,
    underscored: true, // optional agar konsisten
  }
);

export default Jawaban;
