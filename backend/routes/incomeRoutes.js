import express from 'express';
import {
    addIncome,
    getIncomes,
    deleteIncome,
    downloadIncomes,
} from '../controllers/incomeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', protect, addIncome);
router.get('/get', protect, getIncomes);
router.delete('/delete/:id', protect, deleteIncome);
router.get('/download', protect, downloadIncomes);

export default router;
