import { useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import TransactionCard from '../components/TransactionCard';
import './Dashboard.css';

const Dashboard = () => {
    const {
        incomes,
        expenses,
        totalIncome,
        totalExpense,
        totalBalance,
        getIncomes,
        getExpenses,
        deleteIncome,
        deleteExpense,
    } = useGlobalContext();

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, []);

    // Financial Overview Data (Pie Chart)
    const financialData = [
        { name: 'Balance', value: totalBalance > 0 ? totalBalance : 0, color: '#7c3aed' },
        { name: 'Income', value: totalIncome, color: '#16a34a' },
        { name: 'Expense', value: totalExpense, color: '#ef4444' },
    ];

    // Spending Trends (Last 30 days - Bar Chart)
    const getLast30DaysExpenses = () => {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const filteredExpenses = expenses.filter(
            (expense) => new Date(expense.date) >= last30Days
        );

        // Group by date
        const groupedByDate = {};
        filteredExpenses.forEach((expense) => {
            const date = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            groupedByDate[date] = (groupedByDate[date] || 0) + expense.amount;
        });

        return Object.entries(groupedByDate)
            .map(([date, amount]) => ({ date, amount }))
            .slice(-7); // Last 7 days
    };

    // Income Sources (Last 60 days - Pie Chart)
    const getLast60DaysIncomeSources = () => {
        const last60Days = new Date();
        last60Days.setDate(last60Days.getDate() - 60);

        const filteredIncomes = incomes.filter(
            (income) => new Date(income.date) >= last60Days
        );

        // Group by source
        const groupedBySource = {};
        filteredIncomes.forEach((income) => {
            groupedBySource[income.source] = (groupedBySource[income.source] || 0) + income.amount;
        });

        const colors = ['#7c3aed', '#00bfff', '#16a34a', '#f59e0b', '#ef4444'];

        return Object.entries(groupedBySource).map(([source, amount], index) => ({
            name: source,
            value: amount,
            color: colors[index % colors.length],
        }));
    };

    // Recent Transactions (Mixed)
    const recentTransactions = [
        ...incomes.slice(0, 3).map(i => ({ ...i, type: 'income' })),
        ...expenses.slice(0, 3).map(e => ({ ...e, type: 'expense' })),
    ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="gradient-text">Dashboard</h1>
                <p className="dashboard-subtitle">Overview of your financial status</p>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card glass balance-card">
                    <div className="card-icon">
                        <FaWallet />
                    </div>
                    <div className="card-content">
                        <p className="card-label">Total Balance</p>
                        <h2 className="card-value">{formatCurrency(totalBalance)}</h2>
                    </div>
                </div>

                <div className="summary-card glass income-card">
                    <div className="card-icon">
                        <FaArrowUp />
                    </div>
                    <div className="card-content">
                        <p className="card-label">Total Income</p>
                        <h2 className="card-value">{formatCurrency(totalIncome)}</h2>
                    </div>
                </div>

                <div className="summary-card glass expense-card">
                    <div className="card-icon">
                        <FaArrowDown />
                    </div>
                    <div className="card-content">
                        <p className="card-label">Total Expense</p>
                        <h2 className="card-value">{formatCurrency(totalExpense)}</h2>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Financial Overview Pie Chart */}
                <div className="chart-card glass">
                    <h3>Financial Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={financialData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {financialData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Spending Trends Bar Chart */}
                <div className="chart-card glass">
                    <h3>Spending Trends (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getLast30DaysExpenses()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="date" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                            />
                            <Bar dataKey="amount" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Income Sources Pie Chart */}
                {getLast60DaysIncomeSources().length > 0 && (
                    <div className="chart-card glass">
                        <h3>Income Sources (Last 60 Days)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={getLast60DaysIncomeSources()}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {getLast60DaysIncomeSources().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Recent Transactions */}
            <div className="recent-transactions">
                <h3>Recent Transactions</h3>
                <div className="transactions-list">
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction) => (
                            <TransactionCard
                                key={transaction._id}
                                transaction={transaction}
                                type={transaction.type}
                                onDelete={
                                    transaction.type === 'income' ? deleteIncome : deleteExpense
                                }
                            />
                        ))
                    ) : (
                        <p className="no-data">No transactions yet. Start adding some!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
