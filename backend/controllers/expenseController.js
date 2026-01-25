import Expense from '../models/Expense.js';
import XLSX from 'xlsx';

// @desc    Add new expense
// @route   POST /api/v1/expense/add
// @access  Private
export const addExpense = async (req, res) => {
    try {
        const { icon, category, amount, date } = req.body;

        const expense = await Expense.create({
            userId: req.user._id,
            icon,
            category,
            amount,
            date,
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all expenses for user
// @route   GET /api/v1/expense/get
// @access  Private
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/v1/expense/delete/:id
// @access  Private
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check if user owns this expense
        if (expense.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Expense.deleteOne({ _id: req.params.id });
        res.json({ message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Download expenses as Excel
// @route   GET /api/v1/expense/download
// @access  Private
export const downloadExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });

        // Prepare data for Excel
        const data = expenses.map((expense) => ({
            Icon: expense.icon,
            Category: expense.category,
            Amount: expense.amount,
            Date: new Date(expense.date).toLocaleDateString(),
            'Created At': new Date(expense.createdAt).toLocaleDateString(),
        }));

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

        // Generate buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set headers
        res.setHeader('Content-Disposition', 'attachment; filename=expenses.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
