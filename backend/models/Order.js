const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Order = {
  async create(orderData) {
    const { consumerId, farmerId, productId, quantity, totalPrice, deliveryAddress } = orderData;
    const orderId = uuidv4();
    const [result] = await pool.query(
      `INSERT INTO orders (orderId, consumerId, farmerId, productId, quantity, totalPrice, deliveryAddress, status, qrCode, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [orderId, consumerId, farmerId, productId, quantity, totalPrice, deliveryAddress, 'pending', null]
    );
    
    return { id: result.insertId, orderId };
  },

  async findById(orderId) {
    const [rows] = await pool.query(
      `SELECT o.*, 
              f.fullName as farmerName, f.email as farmerEmail, f.phone as farmerPhone,
              c.fullName as consumerName, c.email as consumerEmail,
              p.cropName, p.price, p.location as productLocation
       FROM orders o
       JOIN users f ON o.farmerId = f.id
       JOIN users c ON o.consumerId = c.id
       JOIN products p ON o.productId = p.id
       WHERE o.orderId = ?`,
      [orderId]
    );
    return rows[0] || null;
  },

  async findByConsumerId(consumerId) {
    const [rows] = await pool.query(
      `SELECT o.*, 
              f.fullName as farmerName, f.phone as farmerPhone,
              p.cropName
       FROM orders o
       JOIN users f ON o.farmerId = f.id
       JOIN products p ON o.productId = p.id
       WHERE o.consumerId = ? AND o.deleted = 0
       ORDER BY o.createdAt DESC`,
      [consumerId]
    );
    return rows;
  },

  async findByFarmerId(farmerId) {
    const [rows] = await pool.query(
      `SELECT o.*, 
              c.fullName as consumerName, c.phone as consumerPhone, c.email as consumerEmail,
              p.cropName
       FROM orders o
       JOIN users c ON o.consumerId = c.id
       JOIN products p ON o.productId = p.id
       WHERE o.farmerId = ? AND o.deleted = 0
       ORDER BY o.createdAt DESC`,
      [farmerId]
    );
    return rows;
  },

  async updateStatus(orderId, status) {
    await pool.query('UPDATE orders SET status = ? WHERE orderId = ?', [status, orderId]);
  },

  async updateQRCode(orderId, qrCode) {
    await pool.query('UPDATE orders SET qrCode = ? WHERE orderId = ?', [qrCode, orderId]);
  },

  async assignTransporter(orderId, transporterId) {
    await pool.query('UPDATE orders SET transporterId = ? WHERE orderId = ?', [transporterId, orderId]);
  }
};

module.exports = Order;
