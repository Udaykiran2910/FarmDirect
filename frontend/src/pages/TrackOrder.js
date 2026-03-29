import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { orderService } from '../services/api';
import '../styles/TrackOrder.css';

const TrackOrder = () => {
  const { t } = useLanguage();
  const { orderId } = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracking();
  }, [orderId]);

  const fetchTracking = async () => {
    try {
      const response = await orderService.trackOrder(orderId);
      setTracking(response.data);
    } catch (error) {
      console.error('Failed to fetch tracking', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>{t('loading')}</div>;
  if (!tracking) return <div>{t('error')}</div>;

  const { order, transport, blockchainHistory } = tracking;

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏱️',
      'assigned': '📋',
      'picked': '📦',
      'in_transit': '🚛',
      'delivered': '✅'
    };
    return icons[status] || '❓';
  };

  return (
    <div className="track-order-container">
      <h1>{t('trackOrder')} - {orderId}</h1>

      <div className="track-grid">
        {/* Order Info */}
        <div className="track-section">
          <h2>📦 {t('orderDetails')}</h2>
          <div className="info-box">
            <p><strong>{t('status')}:</strong> {getStatusIcon(order.status)} {order.status}</p>
            <p><strong>{t('quantity')}:</strong> {order.quantity} kg</p>
            <p><strong>{t('totalPrice')}:</strong> ₹{order.totalPrice}</p>
            <p><strong>{t('deliveryAddress')}:</strong> {order.deliveryAddress}</p>
          </div>
        </div>

        {/* Farmer Info */}
        <div className="track-section">
          <h2>👨‍🌾 {t('farmerName')}</h2>
          <div className="info-box">
            <p><strong>{order.farmerName}</strong></p>
            <p>📱 {order.farmerPhone}</p>
            <p>📧 {order.farmerEmail}</p>
          </div>
        </div>

        {/* Transport Info */}
        {transport && (
          <div className="track-section">
            <h2>🚚 {t('transporterName')}</h2>
            <div className="info-box">
              <p><strong>{transport.transporterName}</strong></p>
              <p>📱 {transport.transporterPhone}</p>
              <p>{t('status')}: {getStatusIcon(transport.status)} {transport.status}</p>
              {transport.currentLatitude && (
                <p>📍 GPS: {transport.currentLatitude}, {transport.currentLongitude}</p>
              )}
            </div>
          </div>
        )}

        {/* Blockchain History */}
        <div className="track-section full-width">
          <h2>⛓️ {t('blockchainHistory')}</h2>
          <div className="blockchain-timeline">
            {blockchainHistory.map((record, index) => (
              <div key={index} className="blockchain-record">
                <div className="record-header">
                  <span className="timestamp">{new Date(record.createdAt).toLocaleString()}</span>
                </div>
                <div className="record-content">
                  <p><strong>Block Hash:</strong> {record.blockHash.substring(0, 16)}...</p>
                  <p><strong>Previous Hash:</strong> {record.previousHash.substring(0, 16)}...</p>
                  {record.transportInfo && (
                    <p><strong>Transport:</strong> {JSON.parse(record.transportInfo).status}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
