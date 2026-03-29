const pool = require('../config/database');

const Transport = {
  async create(transportData) {
    const { orderId, transporterId, pickupLocation, deliveryLocation } = transportData;
    
    const [result] = await pool.query(
      `INSERT INTO transport (orderId, transporterId, pickupLocation, deliveryLocation, status, createdAt) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [orderId, transporterId, pickupLocation, deliveryLocation, 'assigned']
    );
    
    return result.insertId;
  },

  async findById(transportId) {
    const [rows] = await pool.query(
      `SELECT t.*, 
              tr.fullName as transporterName, tr.phone as transporterPhone, tr.email as transporterEmail
       FROM transport t
       JOIN users tr ON t.transporterId = tr.id
       WHERE t.id = ?`,
      [transportId]
    );
    return rows[0] || null;
  },

  async findByOrderId(orderId) {
    const [rows] = await pool.query(
      `SELECT t.*, 
              tr.fullName as transporterName, tr.phone as transporterPhone, tr.email as transporterEmail,
              o.deliveryAddress
       FROM transport t
       JOIN users tr ON t.transporterId = tr.id
       JOIN orders o ON t.orderId = o.orderId
       WHERE t.orderId = ?`,
      [orderId]
    );
    return rows[0] || null;
  },

  async findByTransporterId(transporterId) {
    const [rows] = await pool.query(
      `SELECT t.*, o.orderId, p.cropName, u.fullName as consumerName, u.phone as consumerPhone
       FROM transport t
       JOIN orders o ON t.orderId = o.orderId
       JOIN products p ON o.productId = p.id
       JOIN users u ON o.consumerId = u.id
       WHERE t.transporterId = ? AND t.status != 'completed'
       ORDER BY t.createdAt DESC`,
      [transporterId]
    );
    return rows;
  },

  async updateStatus(transportId, status, location = null) {
    if (location) {
      await pool.query(
        'UPDATE transport SET status = ?, currentLocation = ?, updatedAt = NOW() WHERE id = ?',
        [status, location, transportId]
      );
    } else {
      await pool.query(
        'UPDATE transport SET status = ?, updatedAt = NOW() WHERE id = ?',
        [status, transportId]
      );
    }
  },

  async updateLocation(transportId, latitude, longitude) {
    await pool.query(
      'UPDATE transport SET currentLatitude = ?, currentLongitude = ?, updatedAt = NOW() WHERE id = ?',
      [latitude, longitude, transportId]
    );
  }
};

module.exports = Transport;
