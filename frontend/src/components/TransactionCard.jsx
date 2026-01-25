import { FaTrash } from 'react-icons/fa';
import './TransactionCard.css';

const TransactionCard = ({ transaction, onDelete, type }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className={`transaction-card ${type}`}>
            <div className="transaction-icon">
                {transaction.icon}
            </div>

            <div className="transaction-details">
                <h4 className="transaction-title">
                    {transaction.source || transaction.category}
                </h4>
                <p className="transaction-date">{formatDate(transaction.date)}</p>
            </div>

            <div className="transaction-amount">
                <span className={type === 'income' ? 'amount-positive' : 'amount-negative'}>
                    {type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                </span>
            </div>

            <button
                className="transaction-delete"
                onClick={() => onDelete(transaction._id)}
                title="Delete"
            >
                <FaTrash />
            </button>
        </div>
    );
};

export default TransactionCard;
