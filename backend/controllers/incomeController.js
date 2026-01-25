import Income from '../models/Income.js';
import XLSX from 'xlsx';

// @desc    Add new income
// @route   POST /api/v1/income/add
// @access  Private
export const addIncome = async (req, res) => {
    try {
        const { icon, source, amount, date } = req.body;

        const income = await Income.create({
            userId: req.user._id,
            icon,
            source,
            amount,
            date,
        });

        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all incomes for user
// @route   GET /api/v1/income/get
// @access  Private
export const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete income
// @route   DELETE /api/v1/income/delete/:id
// @access  Private
export const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        // Check if user owns this income
        if (income.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Income.deleteOne({ _id: req.params.id });
        res.json({ message: 'Income removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Download incomes as Excel
// @route   GET /api/v1/income/download
// @access  Private
export const downloadIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });

        // Prepare data for Excel
        const data = incomes.map((income) => ({
            Icon: income.icon,
            Source: income.source,
            Amount: income.amount,
            Date: new Date(income.date).toLocaleDateString(),
            'Created At': new Date(income.createdAt).toLocaleDateString(),
        }));

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Incomes');

        // Generate buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set headers
        res.setHeader('Content-Disposition', 'attachment; filename=incomes.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
