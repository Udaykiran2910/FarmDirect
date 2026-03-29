// Main App component
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './i18n/useLanguage';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ConsumerDashboard from './pages/ConsumerDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import TransporterDashboard from './pages/TransporterDashboard';
import ProductDetail from './pages/ProductDetail';
import OrderDetail from './pages/OrderDetail';
import TrackOrder from './pages/TrackOrder';
import ScanQR from './pages/ScanQR';
import './styles/App.css';

// Protected Route
const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/home" />;
  }

  return children;
};

const AppContent = () => {
  const { token } = useAuth();

  return (
    <div className="app">
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        
        {/* Consumer Routes */}
        <Route path="/consumer/dashboard" element={<ProtectedRoute requiredRole="consumer"><ConsumerDashboard /></ProtectedRoute>} />
        <Route path="/product/:productId" element={<ProtectedRoute requiredRole="consumer"><ProductDetail /></ProtectedRoute>} />
        <Route path="/track-order/:orderId" element={<ProtectedRoute requiredRole="consumer"><TrackOrder /></ProtectedRoute>} />
        
        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={<ProtectedRoute requiredRole="farmer"><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/order/:orderId" element={<ProtectedRoute requiredRole="farmer"><OrderDetail /></ProtectedRoute>} />
        
        {/* Transporter Routes */}
        <Route path="/transporter/dashboard" element={<ProtectedRoute requiredRole="transporter"><TransporterDashboard /></ProtectedRoute>} />
        
        {/* QR Scanning */}
        <Route path="/scan-qr" element={<ProtectedRoute><ScanQR /></ProtectedRoute>} />
        <Route path="/qr/:orderId" element={<ScanQR />} />
        
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
