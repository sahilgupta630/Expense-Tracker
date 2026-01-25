import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import {
    FaHome,
    FaMoneyBillWave,
    FaShoppingCart,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaUser
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useGlobalContext();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                {/* User Profile Section */}
                <div className="sidebar-profile">
                    <div className="profile-image">
                        {user?.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt={user.fullName} />
                        ) : (
                            <div className="profile-placeholder">
                                <FaUser />
                            </div>
                        )}
                    </div>
                    <h3 className="profile-name">{user?.fullName}</h3>
                    <p className="profile-email">{user?.email}</p>
                </div>

                {/* Navigation Links */}
                <nav className="sidebar-nav">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        onClick={closeSidebar}
                    >
                        <FaHome />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/incomes"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        onClick={closeSidebar}
                    >
                        <FaMoneyBillWave />
                        <span>Incomes</span>
                    </NavLink>

                    <NavLink
                        to="/expenses"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        onClick={closeSidebar}
                    >
                        <FaShoppingCart />
                        <span>Expenses</span>
                    </NavLink>
                </nav>

                {/* Logout Button */}
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </aside>
        </>
    );
};

export default Sidebar;
