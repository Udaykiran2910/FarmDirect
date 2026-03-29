import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/useLanguage';
import { productService, orderService } from '../services/api';
import '../styles/Dashboard.css';

const FarmerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    price: '',
    quantity: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getFarmerProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderService.getFarmerOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await productService.addProduct(formData);
      setFormData({ cropName: '', price: '', quantity: '', location: '', description: '' });
      setShowAddProduct(false);
      fetchProducts();
      alert(t('productAdded'));
    } catch (error) {
      alert(t('error') + ': ' + (error.response?.data?.error || 'Failed to add product'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await productService.deleteProduct(productId);
        fetchProducts();
        alert(t('productDeleted'));
      } catch (error) {
        alert(t('error'));
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h1>🚜 {t('farmer')} Dashboard</h1>
      
      {/* Farmer Details Card */}
      {user && (
        <div className="dashboard-section" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '25px' }}>
          <h2 style={{ color: 'white', marginTop: 0 }}>👤 {t('profile')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <p style={{ opacity: 0.9, fontSize: '12px', marginBottom: '5px' }}>Full Name</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{user.fullName}</p>
            </div>
            <div>
              <p style={{ opacity: 0.9, fontSize: '12px', marginBottom: '5px' }}>Email</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{user.email}</p>
            </div>
            <div>
              <p style={{ opacity: 0.9, fontSize: '12px', marginBottom: '5px' }}>Phone</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{user.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="dashboard-grid">
        {/* Add Crops Section */}
        <div className="dashboard-section">
          <h2>➕ {t('addProduct')}</h2>
          
          <form onSubmit={handleAddProduct} className="product-form">
            <div className="form-group">
              <label>{t('cropName')}</label>
              <input
                type="text"
                name="cropName"
                value={formData.cropName}
                onChange={handleFormChange}
                placeholder="e.g., Tomato, Wheat"
                required
              />
            </div>

            <div className="form-group">
              <label>{t('price')} (per unit)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                placeholder="₹ Price"
                required
              />
            </div>

            <div className="form-group">
              <label>{t('quantity')} (units)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                placeholder="Total quantity"
                required
              />
            </div>

            <div className="form-group">
              <label>{t('location')}</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="Pick-up location"
                required
              />
            </div>

            <div className="form-group">
              <label>{t('description')}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Add crop details..."
                rows="3"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t('loading') : '✅ ' + t('addProduct')}
            </button>
          </form>
        </div>

        {/* My Crops Section */}
        <div className="dashboard-section">
          <h2>🌾 {t('myProducts')} ({products.length})</h2>
          
          {products.length > 0 ? (
            <div className="products-list">
              {products.map(product => (
                <div key={product.id} className="product-item">
                  <h3>{product.cropName}</h3>
                  <p><strong>💰 Price:</strong> ₹{product.price} per unit</p>
                  <p><strong>📦 Available:</strong> {product.quantity} units</p>
                  <p><strong>📍 Location:</strong> {product.location}</p>
                  {product.description && <p><strong>ℹ️ Info:</strong> {product.description}</p>}
                  <button 
                    className="btn-danger"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              No crops added yet. Add your first crop above!
            </p>
          )}
        </div>
      </div>

      {/* Incoming Orders Section */}
      <div className="dashboard-section" style={{ marginTop: '30px' }}>
        <h2>📨 {t('myOrders')} - Incoming Orders ({orders.length})</h2>
        
        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-item">
                <h3>{order.cropName}</h3>
                <p><strong>👤 From:</strong> {order.consumerName}</p>
                <p><strong>📦 Quantity:</strong> {order.quantity} units</p>
                <p><strong>💵 Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>📍 Delivery:</strong> {order.deliveryAddress}</p>
                <p><strong>🚚 Status:</strong> <span style={{ 
                  background: order.status === 'pending' ? '#ff9800' : 
                             order.status === 'assigned' ? '#2196f3' : 
                             order.status === 'delivered' ? '#4caf50' : '#f44336',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {order.status}
                </span></p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
            No incoming orders yet. When customers order, they'll appear here!
          </p>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
