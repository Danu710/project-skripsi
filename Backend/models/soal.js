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
        model: 'ujian',
        key: 'id_ujian',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    id_kriteria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'kriteria',
        key: 'id_kriteria',
      },
      onDelete: 'SET NULL',
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
        isIn: [['A', 'B', 'C', 'D']],
      },
    },
  },
  {
    tableName: 'soal',
    timestamps: true,
    underscored: true,
  }
);

export default Soal;
