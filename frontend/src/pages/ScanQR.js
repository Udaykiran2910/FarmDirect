import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { orderService } from '../services/api';
import { QRCodeCanvas } from 'qrcode.react';
import '../styles/ScanQR.css';

const ScanQR = () => {
  const { t } = useLanguage();
  const { orderId } = useParams();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchQRCode();
    }
  }, [orderId]);

  const fetchQRCode = async () => {
    try {
      const response = await orderService.getQRCode(orderId);
      setQrData(response.data);
    } catch (error) {
      console.error('Failed to fetch QR code', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>{t('loading')}</div>;

  if (!qrData) {
    return (
      <div className="qr-container">
        <h1>{t('scanQR')}</h1>
        <p>{t('error')}: QR code not found</p>
      </div>
    );
  }

  const { supplyChain } = qrData;

  return (
    <div className="qr-container">
      <h1>🔍 {t('supplyChain')} - {supplyChain.orderId}</h1>

      <div className="qr-grid">
        {/* QR Code */}
        <div className="qr-section">
          <h2>{t('qrCode')}</h2>
          <div className="qr-display">
            <QRCodeCanvas
              value={JSON.stringify(supplyChain)}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <button
            onClick={() => {
              const canvas = document.querySelector('canvas');
              const link = document.createElement('a');
              link.href = canvas.toDataURL();
              link.download = `${supplyChain.orderId}.png`;
              link.click();
            }}
            className="btn-secondary"
          >
            Download QR
          </button>
        </div>

        {/* Supply Chain Details */}
        <div className="qr-section">
          <h2>{t('transparency')}</h2>

          <div className="supply-info">
            <h3>👨‍🌾 {t('farmerName')}</h3>
            <p><strong>{supplyChain.farmerName}</strong></p>
            <p>{supplyChain.farmerPhone}</p>
          </div>

          <div className="supply-info">
            <h3>👤 {t('consumerName')}</h3>
            <p><strong>{supplyChain.consumerName}</strong></p>
            <p>📍 {supplyChain.delivery}</p>
          </div>

          <div className="supply-info">
            <h3>📦 {t('status')}</h3>
            <p><strong>{supplyChain.status}</strong></p>
          </div>

          {/* Blockchain Timeline */}
          <div className="blockchain-timeline">
            <h3>⛓️ {t('blockchainHistory')}</h3>
            {supplyChain.blockchainHistory.map((record, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p>{new Date(record.createdAt).toLocaleString()}</p>
                  <p>Hash: {record.blockHash.substring(0, 20)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
