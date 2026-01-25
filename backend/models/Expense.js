import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        icon: {
            type: String,
            required: [true, 'Icon is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount must be positive'],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
expenseSchema.index({ userId: 1, date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
