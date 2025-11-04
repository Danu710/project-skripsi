import express from 'express';
import {
  createGuru,
  getAllGuru,
  getGuruById,
  updateGuru,
  deleteGuru,
} from '../controllers/guruController.js';

const router = express.Router();

/* Guru routes */
router.post('/', createGuru);
router.get('/', getAllGuru);
router.get('/:id', getGuruById);
router.put('/:id', updateGuru);
router.delete('/:id', deleteGuru);
export default router;
