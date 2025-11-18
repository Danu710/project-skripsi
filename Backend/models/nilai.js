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
      references: {
        model: 'siswa',
        key: 'id_siswa',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    underscored: true, // opsional agar konsisten
  }
);

export default Nilai;
