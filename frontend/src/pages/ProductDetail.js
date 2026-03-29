import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { productService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { t } = useLanguage();
  const { productId } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getProduct(productId);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);

    try {
      await orderService.createOrder({
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        deliveryAddress
      });

      alert(t('orderPlaced'));
      setQuantity(1);
      setDeliveryAddress('');
    } catch (error) {
      alert(t('error'));
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div>{t('loading')}</div>;
  if (!product) return <div>{t('error')}</div>;

  const totalPrice = product.price * quantity;

  return (
    <div className="product-detail-container">
      <div className="product-detail-grid">
        <div className="detail-image">
          <img src={product.image} alt={product.cropName} />
        </div>

        <div className="detail-info">
          <h1>{product.cropName}</h1>
          <p className="farmer">👨‍🌾 {product.farmerName}</p>
          <p className="farmer-contact">📱 {product.farmerPhone}</p>

          <div className="detail-metrics">
            <div className="metric">
              <span className="label">{t('price')}</span>
              <span className="value">₹{product.price}/kg</span>
            </div>
            <div className="metric">
              <span className="label">{t('quantity')}</span>
              <span className="value">{product.quantity} kg available</span>
            </div>
            <div className="metric">
              <span className="label">{t('location')}</span>
              <span className="value">📍 {product.location}</span>
            </div>
          </div>

          {product.description && (
            <div className="description">
              <h3>{t('description')}</h3>
              <p>{product.description}</p>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="order-form">
            <div className="form-group">
              <label>{t('quantity')}</label>
              <input
                type="number"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('deliveryAddress')}</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address"
                required
              ></textarea>
            </div>

            <div className="total-price">
              <span>{t('totalPrice')}:</span>
              <span className="price">₹{totalPrice}</span>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={placing || product.quantity < quantity}
            >
              {placing ? t('loading') : t('placeOrder')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
