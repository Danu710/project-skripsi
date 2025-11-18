import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/userRoutes.js';
import guruRouter from './routes/guruRoutes.js';
import siswaRouter from './routes/siswaRoutes.js';
import materiRouter from './routes/materiRoutes.js';
import ujianRouter from './routes/ujianRoutes.js';
import soalRouter from './routes/soalRoutes.js';
import jawabanRouter from './routes/jawabanRoutes.js';
import nilaiRouter from './routes/nilaiRoutes.js';
import kriteriaRouter from './routes/kriteriaRoutes.js';
import subKriteriaRouter from './routes/subKriteriaRoutes.js';
import sawRouter from './routes/sawRoutes.js';
import authRouter from './routes/authRoutes.js';
import db from './models/index.js';

dotenv.config();
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // frontend Next.js
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json()); // biar bisa baca req.body JSON
app.use('/api/users', usersRouter);
app.use('/api/guru', guruRouter);
app.use('/api/siswa', siswaRouter);
app.use('/api/materi', materiRouter);
app.use('/api/ujian', ujianRouter);
app.use('/api/soal', soalRouter);
app.use('/api/jawaban', jawabanRouter);
app.use('/api/nilai', nilaiRouter);
app.use('/api/auth', authRouter);
app.use('/api/kriteria', kriteriaRouter);
app.use('/api/subkriteria', subKriteriaRouter);
app.use('/api/saw', sawRouter);

const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected');
    await db.sequelize.sync();
    console.log('🧩 Database & tables synced!');

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Failed to connect or sync DB:', err);
  }
})();
