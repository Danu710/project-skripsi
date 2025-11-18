import express from 'express';
import {
  getAllSubkriteria,
  getSubkriteriaById,
  createSubkriteria,
  updateSubkriteria,
  deleteSubkriteria,
} from '../controllers/subkriteriaController.js';

const router = express.Router();

router.get('/', getAllSubkriteria);
router.get('/:id', getSubkriteriaById);
router.post('/', createSubkriteria);
router.put('/:id', updateSubkriteria);
router.delete('/:id', deleteSubkriteria);

export default router;
