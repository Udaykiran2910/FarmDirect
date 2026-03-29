// Auth context for managing authentication state
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || 'consumer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    // Ensure role is synced from localStorage
    const storedRole = localStorage.getItem('role');
    if (storedRole && storedRole !== role) {
      setRole(storedRole);
    }
  }, [token]);

  const login = async (email, password, selectedRole) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        role: selectedRole
      });

      const { token: newToken, user: userData } = response.data;
      const userRole = userData.role || selectedRole;
      
      setToken(newToken);
      setUser(userData);
      setRole(userRole);
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', userRole);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);
      setRole(userData.role);
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('user', JSON.stringify(newUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole('consumer');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const switchRole = async (newRole) => {
    try {
      const response = await axios.post('/api/auth/switch-role', { newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newToken = response.data.token;
      setToken(newToken);
      setRole(newRole);
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', newRole);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Role switch failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
