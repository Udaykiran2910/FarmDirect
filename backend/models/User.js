const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const User = {
  async create(userData) {
    const { email, password, phone, role, fullName } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      'INSERT INTO users (email, password, phone, fullName, primaryRole, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [email, hashedPassword, phone, fullName, role]
    );
    
    const userId = result.insertId;
    
    // Add the primary role to user_roles table
    await pool.query(
      'INSERT INTO user_roles (userId, role) VALUES (?, ?)',
      [userId, role]
    );
    
    return userId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(userId) {
    const [rows] = await pool.query('SELECT id, email, phone, fullName, primaryRole, createdAt FROM users WHERE id = ?', [userId]);
    return rows[0] || null;
  },

  async addRole(userId, role) {
    await pool.query('INSERT INTO user_roles (userId, role) VALUES (?, ?)', [userId, role]);
  },

  async getUserRoles(userId) {
    const [rows] = await pool.query(
      'SELECT role FROM user_roles WHERE userId = ? UNION SELECT primaryRole as role FROM users WHERE id = ?',
      [userId, userId]
    );
    return rows.map(r => r.role);
  },

  async updateProfile(userId, updateData) {
    const { fullName, phone } = updateData;
    await pool.query(
      'UPDATE users SET fullName = ?, phone = ? WHERE id = ?',
      [fullName, phone, userId]
    );
  }
};

module.exports = User;
