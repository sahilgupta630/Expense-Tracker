import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema(
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
        source: {
            type: String,
            required: [true, 'Income source is required'],
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
incomeSchema.index({ userId: 1, date: -1 });

const Income = mongoose.model('Income', incomeSchema);

export default Income;
