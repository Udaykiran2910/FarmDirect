import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { t } = useLanguage();

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.cropName} />
      </div>
      <div className="product-info">
        <h3>{product.cropName}</h3>
        <p className="farmer-name">👨‍🌾 {product.farmerName}</p>
        <div className="product-details">
          <span className="price">₹{product.price}</span>
          <span className="quantity">{product.quantity} kg</span>
        </div>
        <p className="location">📍 {product.location}</p>
        {product.description && <p className="description">{product.description}</p>}
        <Link to={`/product/${product.id}`} className="btn-primary">
          {t('browseProducts')}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
