import React, { useState } from 'react';
import { useLanguage } from '../i18n/useLanguage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const { t, language, changeLanguage } = useLanguage();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setShowLangMenu(false);
  };

  const getDashboardUrl = () => {
    if (role === 'consumer') return '/consumer/dashboard';
    if (role === 'farmer') return '/farmer/dashboard';
    if (role === 'transporter') return '/transporter/dashboard';
    return '/home';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/home">🌾 FarmDirect</a>
        </div>

        <div className="navbar-center">
          <a href={getDashboardUrl()} className="nav-link">{t('dashboard')}</a>
          <a href="/home" className="nav-link">{t('navHome')}</a>
        </div>

        <div className="navbar-right">
          {/* Language Selector */}
          <div className="dropdown">
            <button className="dropdown-btn">🌐 {t('language')}</button>
            <div className="dropdown-content">
              <a onClick={() => handleLanguageChange('en')}>English</a>
              <a onClick={() => handleLanguageChange('te')}>తెలుగు</a>
              <a onClick={() => handleLanguageChange('hi')}>हिंदी</a>
            </div>
          </div>

          {/* User Role Badge */}
          <span className="role-badge">{t(role)}</span>

          {/* Profile and Logout */}
          <span className="user-name">{user?.fullName}</span>
          <button className="logout-btn" onClick={handleLogout}>{t('navLogout')}</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
