import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import {
    BarChart,
    Bar,
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

const Incomes = () => {
    const {
        incomes,
        getIncomes,
        addIncome,
        deleteIncome,
        downloadIncomes,
        loading
    } = useGlobalContext();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getIncomes();
    }, []);

    // Chart Data - Group by date
    const getChartData = () => {
        const groupedByDate = {};

        incomes.forEach((income) => {
            const date = new Date(income.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            groupedByDate[date] = (groupedByDate[date] || 0) + income.amount;
        });

        return Object.entries(groupedByDate)
            .map(([date, amount]) => ({ date, amount }))
            .slice(-10); // Last 10 entries
    };

    const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    return (
        <div className="incomes-page">
            <div className="page-header">
                <div>
                    <h1 className="gradient-text">Incomes</h1>
                    <p className="page-subtitle">Track your earnings and income sources</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={downloadIncomes}>
                        <FaDownload /> Export
                    </button>
                    <button className="btn btn-success" onClick={() => setIsModalOpen(true)}>
                        <FaPlus /> Add Income
                    </button>
                </div>
            </div>

            {/* Total Income Card */}
            <div className="total-card glass income-total">
                <h3>Total Income</h3>
                <p className="total-amount">{formatCurrency(totalIncome)}</p>
            </div>

            {/* Income Chart */}
            {incomes.length > 0 && (
                <div className="chart-section glass">
                    <h3>Income Trends</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="date" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                            />
                            <Bar dataKey="amount" fill="#16a34a" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Incomes List */}
            <div className="transactions-section">
                <h3>All Incomes</h3>
                <div className="transactions-grid">
                    {incomes.length > 0 ? (
                        incomes.map((income) => (
                            <TransactionCard
                                key={income._id}
                                transaction={income}
                                type="income"
                                onDelete={deleteIncome}
                            />
                        ))
                    ) : (
                        <div className="no-data">
                            <p>No incomes yet. Click "Add Income" to get started!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Income Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addIncome}
                type="income"
                loading={loading}
            />
        </div>
    );
};

export default Incomes;
