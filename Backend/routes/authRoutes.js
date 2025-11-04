// routes/authRoutes.js
import express from 'express';
import { loginSiswa } from '../controllers/authSiswaController.js';
import { loginGuru } from '../controllers/authGuruController.js';

const router = express.Router();

router.post('/siswa/login', loginSiswa);
router.post('/guru/login', loginGuru);

export default router;
