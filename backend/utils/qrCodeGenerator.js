const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

class QRCodeGenerator {
  static async generateQRCode(data, orderId) {
    try {
      const qrDir = path.join(__dirname, '../../frontend/public/qr-codes');
      if (!fs.existsSync(qrDir)) {
        fs.mkdirSync(qrDir, { recursive: true });
      }

      const filePath = path.join(qrDir, `${orderId}.png`);
      await QRCode.toFile(filePath, JSON.stringify(data), {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95
      });

      return `/qr-codes/${orderId}.png`;
    } catch (error) {
      console.error('QR Code Generation Error:', error);
      throw error;
    }
  }

  static async generateQRCodeDataUrl(data) {
    try {
      const dataUrl = await QRCode.toDataURL(JSON.stringify(data), {
        errorCorrectionLevel: 'H'
      });
      return dataUrl;
    } catch (error) {
      console.error('QR Code Data URL Generation Error:', error);
      throw error;
    }
  }
}

module.exports = QRCodeGenerator;
