import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import '../styles/OrderDetail.css';

const OrderDetail = () => {
  const { t } = useLanguage();
  const { orderId } = useParams();

  return (
    <div className="order-detail-container">
      <h1>{t('orderDetails')}</h1>
      <p>{orderId}</p>
    </div>
  );
};

export default OrderDetail;
