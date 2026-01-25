import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { FaTimes, FaSmile } from 'react-icons/fa';
import './TransactionModal.css';

const TransactionModal = ({ isOpen, onClose, onSubmit, type, loading }) => {
    const [formData, setFormData] = useState({
        icon: '💰',
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEmojiClick = (emojiObject) => {
        setFormData({ ...formData, icon: emojiObject.emoji });
        setShowEmojiPicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            icon: formData.icon,
            [type === 'income' ? 'source' : 'category']: formData.title,
            amount: parseFloat(formData.amount),
            date: formData.date,
        };

        await onSubmit(data);

        // Reset form
        setFormData({
            icon: '💰',
            title: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add {type === 'income' ? 'Income' : 'Expense'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Emoji Picker */}
                    <div className="form-group">
                        <label className="form-label">Icon</label>
                        <div className="emoji-selector">
                            <button
                                type="button"
                                className="emoji-button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <span className="selected-emoji">{formData.icon}</span>
                                <FaSmile />
                            </button>

                            {showEmojiPicker && (
                                <div className="emoji-picker-wrapper">
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiClick}
                                        theme="dark"
                                        width="100%"
                                        height="350px"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label">
                            {type === 'income' ? 'Source' : 'Category'}
                        </label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder={type === 'income' ? 'e.g., Salary, Freelance' : 'e.g., Rent, Food'}
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Amount */}
                    <div className="form-group">
                        <label className="form-label">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            className="form-input"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Date */}
                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            name="date"
                            className="form-input"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`btn ${type === 'income' ? 'btn-success' : 'btn-danger'} btn-block`}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
