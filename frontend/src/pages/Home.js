import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/useLanguage';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const Home = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', location: '' });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts(filters);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🌾 {t('navProducts')}</h1>
        <p>Fresh produce directly from farmers to your table</p>
      </div>

      <div className="filters-section">
        <input
          type="text"
          name="search"
          placeholder={t('search')}
          value={filters.search}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="location"
          placeholder={t('location')}
          value={filters.location}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <button onClick={fetchProducts} className="btn-secondary">{t('filter')}</button>
      </div>

      <div className="products-grid">
        {loading ? (
          <div className="loading">{t('loading')}</div>
        ) : products.length > 0 ? (
          products.map(product => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="no-products">{t('noProducts')}</div>
        )}
      </div>
    </div>
  );
};

export default Home;
