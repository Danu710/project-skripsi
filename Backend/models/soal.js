// models/soal.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Soal = sequelize.define(
  'Soal',
  {
    id_soal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_ujian: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ujian', // nama tabel di database
        key: 'id_ujian',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    pertanyaan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    opsi_a: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    opsi_b: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    opsi_c: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    opsi_d: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jawaban_benar: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['A', 'B', 'C', 'D']], // biar jawaban cuma A/B/C/D
      },
    },
  },
  {
    tableName: 'soal',
    timestamps: true, // createdAt & updatedAt
    underscored: true, // pakai snake_case
  }
);

export default Soal;
