import express from 'express';
import {
  createJawaban,
  getAllJawaban,
  getJawabanById,
  updateJawaban,
  deleteJawaban,
} from '../controllers/jawabanController.js';

const router = express.Router();

/* Jawaban routes */
router.post('/', createJawaban);
router.get('/', getAllJawaban);
router.get('/:id', getJawabanById);
router.put('/:id', updateJawaban);
router.delete('/:id', deleteJawaban);

export default router;
