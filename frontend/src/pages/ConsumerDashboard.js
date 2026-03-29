import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/useLanguage';
import { orderService, productService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const ConsumerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPlaceOrder, setShowPlaceOrder] = useState(false);
  const [selectedOrderForQR, setSelectedOrderForQR] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    deliveryAddress: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getConsumerOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await orderService.createOrder({
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        deliveryAddress: formData.deliveryAddress
      });

      setFormData({ productId: '', quantity: '', deliveryAddress: '' });
      setShowPlaceOrder(false);
      fetchOrders();
      alert(t('orderPlaced'));
    } catch (error) {
      alert(t('error') + ': ' + (error.response?.data?.error || 'Failed to place order'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewQRCode = async (orderId) => {
    try {
      const response = await orderService.getQRCode(orderId);
      setQrCode(response.data);
      setSelectedOrderForQR(orderId);
    } catch (error) {
      console.error('QR Code Error:', error.response?.data || error.message);
      alert('Failed to load QR code: ' + (error.response?.data?.error || error.message));
    }
  };

  const selectedProduct = formData.productId ? products.find(p => p.id === parseInt(formData.productId)) : null;

  return (
    <div className="dashboard-container">
      <h1>👨‍🌾 {t('consumer')} Dashboard</h1>
      
      <div className="dashboard-grid">
        {/* Place New Order Section */}
        <div className="dashboard-section">
          <h2>🛒 {t('placeOrder')}</h2>
          
          {showPlaceOrder ? (
            <form onSubmit={handlePlaceOrder} className="order-form">
              <div className="form-group">
                <label>{t('selectProduct')}</label>
                <select 
                  name="productId"
                  value={formData.productId}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Choose a crop...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.cropName} - ₹{product.price}/unit
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div style={{ background: '#f8f9fb', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                  <p><strong>🌾 Crop:</strong> {selectedProduct.cropName}</p>
                  <p><strong>💰 Price:</strong> ₹{selectedProduct.price} per unit</p>
                  <p><strong>📦 Available:</strong> {selectedProduct.quantity} units</p>
                </div>
              )}

              <div className="form-group">
                <label>{t('quantity')}</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  placeholder="How many units?"
                  min="1"
                  required
                />
              </div>

              {formData.quantity && selectedProduct && (
                <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                  <p><strong>💵 Total Cost:</strong> ₹{selectedProduct.price * parseInt(formData.quantity)}</p>
                </div>
              )}

              <div className="form-group">
                <label>{t('deliveryAddress')}</label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleFormChange}
                  placeholder="Where should we deliver?"
                  rows="3"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? t('loading') : '✅ Confirm Order'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setShowPlaceOrder(false);
                    setFormData({ productId: '', quantity: '', deliveryAddress: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button 
              className="btn-primary" 
              onClick={() => setShowPlaceOrder(true)}
            >
              🛒 Place New Order
            </button>
          )}
        </div>

        {/* My Orders Section */}
        <div className="dashboard-section">
          <h2>📦 My Orders ({orders.length})</h2>
          
          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-item">
                  <h3>{order.cropName}</h3>
                  <p><strong>🚜 From:</strong> {order.farmerName}</p>
                  <p><strong>📦 Quantity:</strong> {order.quantity} units</p>
                  <p><strong>💵 Total:</strong> ₹{order.totalPrice}</p>
                  <p><strong>🚚 Status:</strong> <span style={{ 
                    background: order.status === 'pending' ? '#ff9800' : 
                               order.status === 'assigned' ? '#2196f3' : 
                               order.status === 'in_transit' ? '#9c27b0' :
                               order.status === 'delivered' ? '#4caf50' : '#f44336',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {order.status.replace('_', ' ')}
                  </span></p>
                  <button 
                    className="btn-secondary"
                    onClick={() => handleViewQRCode(order.orderId)}
                    style={{ marginTop: '10px' }}
                  >
                    📱 View QR Code
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              No orders yet. Place your first order!
            </p>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedOrderForQR && qrCode && (
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
          zIndex: 1000,
          overflow: 'auto'
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%', margin: 'auto' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e3c72' }}>📱 Order QR Code</h3>
            
            {/* QR Code Image */}
            {qrCode.qrCodeUrl && (
              <div style={{ marginBottom: '25px', textAlign: 'center', padding: '20px', background: '#f8f9fb', borderRadius: '8px' }}>
                <img 
                  src={qrCode.qrCodeUrl} 
                  alt="Order QR Code" 
                  style={{ maxWidth: '100%', height: 'auto', border: '3px solid #1e3c72', borderRadius: '8px' }}
                />
              </div>
            )}

            {/* Order Details */}
            {qrCode.orderDetails && (
              <div style={{ marginBottom: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>📦 Order Details</h4>
                <p style={{ margin: '5px 0' }}><strong>Order ID:</strong> {qrCode.orderDetails.orderId}</p>
                <p style={{ margin: '5px 0' }}><strong>Crop:</strong> {qrCode.orderDetails.cropName}</p>
                <p style={{ margin: '5px 0' }}><strong>Quantity:</strong> {qrCode.orderDetails.quantity} units</p>
                <p style={{ margin: '5px 0' }}><strong>Total Price:</strong> ₹{qrCode.orderDetails.totalPrice}</p>
                <p style={{ margin: '5px 0' }}><strong>Status:</strong> {qrCode.orderDetails.status}</p>
              </div>
            )}

            {/* Farmer Details */}
            {qrCode.farmerDetails && (
              <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>👨‍🌾 Farmer Details</h4>
                <p style={{ margin: '5px 0' }}><strong>Name:</strong> {qrCode.farmerDetails.name}</p>
                <p style={{ margin: '5px 0' }}><strong>📞 Phone:</strong> {qrCode.farmerDetails.phone}</p>
                <p style={{ margin: '5px 0' }}><strong>📧 Email:</strong> {qrCode.farmerDetails.email}</p>
              </div>
            )}

            {/* Location Details */}
            {qrCode.locationDetails && (
              <div style={{ marginBottom: '20px', padding: '15px', background: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#e65100' }}>📍 Locations</h4>
                <p style={{ margin: '5px 0' }}><strong>🚜 Pickup Location:</strong> {qrCode.locationDetails.pickupLocation}</p>
                <p style={{ margin: '5px 0' }}><strong>🏠 Delivery Location:</strong> {qrCode.locationDetails.deliveryLocation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                className="btn-primary"
                onClick={() => {
                  setSelectedOrderForQR(null);
                  setQrCode(null);
                }}
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button 
                className="btn-secondary"
                onClick={() => {
                  const qrElement = document.querySelector('[alt="Order QR Code"]');
                  if (qrElement) {
                    const link = document.createElement('a');
                    link.href = qrCode.qrCodeUrl;
                    link.download = `order-${selectedOrderForQR}.png`;
                    link.click();
                  }
                }}
                style={{ flex: 1 }}
              >
                ⬇️ Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerDashboard;
