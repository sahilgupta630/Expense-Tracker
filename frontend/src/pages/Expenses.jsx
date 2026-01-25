import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { FaPlus, FaDownload } from 'react-icons/fa';
import TransactionCard from '../components/TransactionCard';
import TransactionModal from '../components/TransactionModal';
import './IncomesExpenses.css';

const Expenses = () => {
    const {
        expenses,
        getExpenses,
        addExpense,
        deleteExpense,
        downloadExpenses,
        loading
    } = useGlobalContext();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getExpenses();
    }, []);

    // Chart Data - Group by date
    const getChartData = () => {
        const groupedByDate = {};

        expenses.forEach((expense) => {
            const date = new Date(expense.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            groupedByDate[date] = (groupedByDate[date] || 0) + expense.amount;
        });

        return Object.entries(groupedByDate)
            .map(([date, amount]) => ({ date, amount }))
            .slice(-10); // Last 10 entries
    };

    const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    return (
        <div className="expenses-page">
            <div className="page-header">
                <div>
                    <h1 className="gradient-text">Expenses</h1>
                    <p className="page-subtitle">Monitor your spending and expenses</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={downloadExpenses}>
                        <FaDownload /> Export
                    </button>
                    <button className="btn btn-danger" onClick={() => setIsModalOpen(true)}>
                        <FaPlus /> Add Expense
                    </button>
                </div>
            </div>

            {/* Total Expense Card */}
            <div className="total-card glass expense-total">
                <h3>Total Expense</h3>
                <p className="total-amount">{formatCurrency(totalExpense)}</p>
            </div>

            {/* Expense Chart */}
            {expenses.length > 0 && (
                <div className="chart-section glass">
                    <h3>Spending Patterns</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="date" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{ fill: '#ef4444', r: 6 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Expenses List */}
            <div className="transactions-section">
                <h3>All Expenses</h3>
                <div className="transactions-grid">
                    {expenses.length > 0 ? (
                        expenses.map((expense) => (
                            <TransactionCard
                                key={expense._id}
                                transaction={expense}
                                type="expense"
                                onDelete={deleteExpense}
                            />
                        ))
                    ) : (
                        <div className="no-data">
                            <p>No expenses yet. Click "Add Expense" to get started!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Expense Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addExpense}
                type="expense"
                loading={loading}
            />
        </div>
    );
};

export default Expenses;
