import express from 'express';
import {
    addExpense,
    getExpenses,
    deleteExpense,
    downloadExpenses,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', protect, addExpense);
router.get('/get', protect, getExpenses);
router.delete('/delete/:id', protect, deleteExpense);
router.get('/download', protect, downloadExpenses);

export default router;
