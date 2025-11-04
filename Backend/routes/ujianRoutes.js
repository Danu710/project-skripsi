import express from 'express';
import { createUjian, getAllUjian } from '../controllers/ujianController.js';

const router = express.Router();

router.post('/', createUjian);
router.get('/', getAllUjian);

export default router;
