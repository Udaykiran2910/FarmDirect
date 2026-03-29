import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/useLanguage';
import '../styles/Auth.css';

const Register = () => {
  const { t } = useLanguage();
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'consumer'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData);
      navigate(`/${formData.role}/dashboard`);
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : (err?.error || err?.message || 'Registration failed');
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🌾 FarmDirect</h1>
        <h2>{t('register')}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('fullName')}</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your Full Name"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('phone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
            />
          </div>

          <div className="form-group">
            <label>{t('password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('role')}</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="consumer">👨‍🌾 {t('consumer')}</option>
              <option value="farmer">🚜 {t('farmer')}</option>
              <option value="transporter">🚚 {t('transporter')}</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('loading') : t('register')}
          </button>
        </form>

        <div className="auth-footer">
          <p>{t('alreadyHaveAccount')} <Link to="/login">{t('login')}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
