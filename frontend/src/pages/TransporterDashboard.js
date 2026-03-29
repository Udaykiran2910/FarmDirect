import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/useLanguage';
import { transportService } from '../services/api';
import '../styles/Dashboard.css';

const TransporterDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await transportService.getDeliveries();
      setDeliveries(response.data);
    } catch (error) {
      console.error('Failed to fetch deliveries', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (transportId) => {
    if (!newStatus) {
      alert('Select a status');
      return;
    }

    try {
      await transportService.updateStatus(transportId, {
        status: newStatus,
        latitude: latitude || null,
        longitude: longitude || null
      });

      setNewStatus('');
      setLatitude('');
      setLongitude('');
      setSelectedDelivery(null);
      fetchDeliveries();
      alert('Status updated successfully');
    } catch (error) {
      alert('Error updating status');
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      });
    }
  };

  // Separate deliveries by status
  const pendingDeliveries = deliveries.filter(d => d.status === 'assigned');
  const activeDeliveries = deliveries.filter(d => d.status === 'picked' || d.status === 'in_transit');
  const completedDeliveries = deliveries.filter(d => d.status === 'completed');

  return (
    <div className="dashboard-container">
      <h1>🚚 {t('transporter')} Dashboard - Like Rapido</h1>
      
      {/* Pending Deliveries */}
      <div className="dashboard-section" style={{ borderTopColor: '#ff9800' }}>
        <h2>📨 {t('myDeliveries')} Pending ({pendingDeliveries.length})</h2>
        <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
          🔔 New delivery requests waiting for you to accept
        </p>
        
        {pendingDeliveries.length > 0 ? (
          <div className="deliveries-list">
            {pendingDeliveries.map(delivery => (
              <div key={delivery.id} className="delivery-item" style={{ borderLeftColor: '#ff9800' }}>
                <h3>{delivery.cropName}</h3>
                <p><strong>👤 From:</strong> {delivery.farmerName}</p>
                <p><strong>👥 To:</strong> {delivery.consumerName}</p>
                <p><strong>📍 Pickup:</strong> {delivery.pickupLocation}</p>
                <p><strong>📍 Drop:</strong> {delivery.deliveryLocation}</p>
                <p><strong>📦 Amount:</strong> {delivery.quantity} units</p>
                <button 
                  className="btn-primary"
                  onClick={() => setSelectedDelivery(delivery.id)}
                  style={{ marginTop: '10px' }}
                >
                  ✅ Accept Delivery
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
            No pending deliveries. Check back soon for new orders!
          </p>
        )}
      </div>

      {/* Active Deliveries */}
      {activeDeliveries.length > 0 && (
        <div className="dashboard-section" style={{ marginTop: '30px', borderTopColor: '#2196f3' }}>
          <h2>🚗 Active Deliveries ({activeDeliveries.length})</h2>
          <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
            ⏳ Deliveries currently in progress
          </p>
          
          <div className="deliveries-list">
            {activeDeliveries.map(delivery => (
              <div key={delivery.id} className="delivery-item" style={{ borderLeftColor: '#2196f3' }}>
                <h3>{delivery.cropName}</h3>
                <p><strong>📍 Pickup:</strong> {delivery.pickupLocation}</p>
                <p><strong>📍 Drop:</strong> {delivery.deliveryLocation}</p>
                <p><strong>🎯 Current Status:</strong> <span style={{ 
                  background: '#2196f3',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {delivery.status === 'picked' ? 'Picked Up' : 'In Transit'}
                </span></p>
                {(delivery.currentLatitude && delivery.currentLongitude) && (
                  <p><strong>📡 Coordinates:</strong> {delivery.currentLatitude.toFixed(4)}, {delivery.currentLongitude.toFixed(4)}</p>
                )}
                <button 
                  className="btn-secondary"
                  onClick={() => setSelectedDelivery(delivery.id)}
                  style={{ marginTop: '10px' }}
                >
                  📍 Update Status
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Deliveries */}
      {completedDeliveries.length > 0 && (
        <div className="dashboard-section" style={{ marginTop: '30px', borderTopColor: '#4caf50' }}>
          <h2>✅ Completed ({completedDeliveries.length})</h2>
          <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
            ✔️ Successfully delivered orders
          </p>
          
          <div className="deliveries-list">
            {completedDeliveries.map(delivery => (
              <div key={delivery.id} className="delivery-item" style={{ borderLeftColor: '#4caf50', opacity: 0.8 }}>
                <h3>{delivery.cropName}</h3>
                <p><strong>👤 Consumer:</strong> {delivery.consumerName}</p>
                <p><strong>📍 Location:</strong> {delivery.deliveryLocation}</p>
                <p style={{ color: '#4caf50', fontWeight: 'bold' }}>✅ Completed</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedDelivery && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e3c72' }}>Update Status</h3>
            
            <div className="form-group">
              <label>New Status</label>
              <select 
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Select status...</option>
                <option value="picked">✅ Picked Up</option>
                <option value="in_transit">🚗 In Transit</option>
                <option value="completed">✔️ Delivered</option>
              </select>
            </div>

            <button 
              className="btn-secondary"
              onClick={getLocation}
              style={{ width: '100%', marginBottom: '10px' }}
            >
              📍 Get Current Location
            </button>

            {latitude && longitude && (
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                📡 Location: {latitude.substring(0, 10)}, {longitude.substring(0, 10)}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-primary"
                onClick={() => handleUpdateStatus(selectedDelivery)}
                style={{ flex: 1 }}
              >
                Update
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setSelectedDelivery(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransporterDashboard;
