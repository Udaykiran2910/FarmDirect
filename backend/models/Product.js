const pool = require('../config/database');

const Product = {
  async create(productData) {
    const { farmerId, cropName, price, quantity, location, image, description } = productData;
    
    const [result] = await pool.query(
      'INSERT INTO products (farmerId, cropName, price, quantity, location, image, description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [farmerId, cropName, price, quantity, location, image, description]
    );
    
    return result.insertId;
  },

  async findById(productId) {
    const [rows] = await pool.query(
      `SELECT p.*, u.fullName as farmerName, u.email as farmerEmail, u.phone as farmerPhone 
       FROM products p 
       JOIN users u ON p.farmerId = u.id 
       WHERE p.id = ?`,
      [productId]
    );
    return rows[0] || null;
  },

  async findByFarmerId(farmerId) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE farmerId = ? ORDER BY createdAt DESC',
      [farmerId]
    );
    return rows;
  },

  async findAll(filters = {}) {
    let query = `SELECT p.*, u.fullName as farmerName, u.phone as farmerPhone 
                 FROM products p 
                 JOIN users u ON p.farmerId = u.id 
                 WHERE 1=1`;
    const params = [];

    if (filters.cropName) {
      query += ' AND p.cropName LIKE ?';
      params.push(`%${filters.cropName}%`);
    }

    if (filters.location) {
      query += ' AND p.location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    if (filters.minPrice) {
      query += ' AND p.price >= ?';
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += ' AND p.price <= ?';
      params.push(filters.maxPrice);
    }

    query += ' ORDER BY p.createdAt DESC LIMIT 100';

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async updateQuantity(productId, newQuantity) {
    await pool.query(
      'UPDATE products SET quantity = ? WHERE id = ?',
      [newQuantity, productId]
    );
  },

  async update(productId, updateData) {
    const { cropName, price, quantity, location, image, description } = updateData;
    await pool.query(
      'UPDATE products SET cropName = ?, price = ?, quantity = ?, location = ?, image = ?, description = ? WHERE id = ?',
      [cropName, price, quantity, location, image, description, productId]
    );
  },

  async delete(productId) {
    await pool.query('DELETE FROM products WHERE id = ?', [productId]);
  }
};

module.exports = Product;
