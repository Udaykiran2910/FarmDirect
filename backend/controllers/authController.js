const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AuthController = {
  async register(req, res) {
    try {
      const { email, password, phone, role, fullName } = req.body;

      if (!email || !password || !role || !fullName) {
        return res.status(400).json({ error: 'All fields required' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const userId = await User.create({ email, password, phone, role, fullName });

      const token = jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.status(201).json({
        success: true,
        token,
        user: { id: userId, email, fullName, role }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role required' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        success: true,
        token,
        user: { id: user.id, email: user.email, fullName: user.fullName, phone: user.phone, role }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId);
      const roles = await User.getUserRoles(req.userId);

      res.json({
        user: { ...user, roles }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const { fullName, phone } = req.body;
      await User.updateProfile(req.userId, { fullName, phone });
      
      const user = await User.findById(req.userId);
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async switchRole(req, res) {
    try {
      const { newRole } = req.body;
      const roles = await User.getUserRoles(req.userId);

      if (!roles.includes(newRole)) {
        return res.status(403).json({ error: 'Role not available for this user' });
      }

      const token = jwt.sign(
        { userId: req.userId, role: newRole },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({ success: true, token, role: newRole });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = AuthController;
