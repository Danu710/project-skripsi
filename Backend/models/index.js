// models/index.js
import sequelize from '../config/db.js';
import Guru from './guru.js';
import Siswa from './siswa.js';
import Materi from './materi.js';
import Ujian from './ujian.js';
import Soal from './soal.js';
import Jawaban from './jawaban.js';
import Nilai from './nilai.js';

/* Relasi berdasarkan ERD */
// Guru - Materi (1:N)
Guru.hasMany(Materi, { foreignKey: 'id_guru', onDelete: 'CASCADE' });
Materi.belongsTo(Guru, { foreignKey: 'id_guru' });

// Guru - Ujian (1:N)
Guru.hasMany(Ujian, { foreignKey: 'id_guru', onDelete: 'CASCADE' });
Ujian.belongsTo(Guru, { foreignKey: 'id_guru' });

// Ujian - Soal (1:N)
Ujian.hasMany(Soal, { foreignKey: 'id_ujian', onDelete: 'CASCADE' });
Soal.belongsTo(Ujian, { foreignKey: 'id_ujian' });

// Soal - Jawaban (1:N)
Soal.hasMany(Jawaban, { foreignKey: 'id_soal', onDelete: 'CASCADE' });
Jawaban.belongsTo(Soal, { foreignKey: 'id_soal' });

// Siswa - Jawaban (1:N)
Siswa.hasMany(Jawaban, { foreignKey: 'id_siswa', onDelete: 'CASCADE' });
Jawaban.belongsTo(Siswa, { foreignKey: 'id_siswa' });

// Ujian - Jawaban (1:N)
Ujian.hasMany(Jawaban, { foreignKey: 'id_ujian', onDelete: 'CASCADE' });
Jawaban.belongsTo(Ujian, { foreignKey: 'id_ujian' });

// Siswa - Nilai (1:N)
Siswa.hasMany(Nilai, { foreignKey: 'id_siswa', onDelete: 'CASCADE' });
Nilai.belongsTo(Siswa, { foreignKey: 'id_siswa' });

// Ujian - Nilai (1:N)
Ujian.hasMany(Nilai, { foreignKey: 'id_ujian', onDelete: 'CASCADE' });
Nilai.belongsTo(Ujian, { foreignKey: 'id_ujian' });

const db = {
  sequelize,
  Guru,
  Siswa,
  Materi,
  Ujian,
  Soal,
  Jawaban,
  Nilai,
};

export default db;
