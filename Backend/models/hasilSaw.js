import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const HasilSaw = sequelize.define(
  'HasilSaw',
  {
    id_hasil: {
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
      type: DataTypes.DOUBLE,
      allowNull: false,
    },

    ranking: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'hasil_saw',
    timestamps: true,
    underscored: true,
  }
);

export default HasilSaw;
