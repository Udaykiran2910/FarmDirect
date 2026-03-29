import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/useLanguage';
import '../styles/Auth.css';

const Login = () => {
  const { t } = useLanguage();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'consumer' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password, formData.role);
      navigate(`/${formData.role}/dashboard`);
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : (err?.error || err?.message || 'Login failed');
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🌾 FarmDirect</h1>
        <h2>{t('login')}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            <span className="role-label">{t('role')} - {t('selectRole')}</span>
            <div className="role-options">
              <div className="role-option">
                <input
                  type="radio"
                  id="consumer"
                  name="role"
                  value="consumer"
                  checked={formData.role === 'consumer'}
                  onChange={() => handleRoleChange('consumer')}
                />
                <label htmlFor="consumer">👤 {t('consumer')}</label>
              </div>
              <div className="role-option">
                <input
                  type="radio"
                  id="farmer"
                  name="role"
                  value="farmer"
                  checked={formData.role === 'farmer'}
                  onChange={() => handleRoleChange('farmer')}
                />
                <label htmlFor="farmer">🚜 {t('farmer')}</label>
              </div>
              <div className="role-option">
                <input
                  type="radio"
                  id="transporter"
                  name="role"
                  value="transporter"
                  checked={formData.role === 'transporter'}
                  onChange={() => handleRoleChange('transporter')}
                />
                <label htmlFor="transporter">🚚 {t('transporter')}</label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('loading') : t('login')}
          </button>
        </form>

        <div className="auth-footer">
          <p>{t('dontHaveAccount')} <Link to="/register">{t('register')}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
