const Product = require('../models/Product');
const User = require('../models/User');

const ProductController = {
  async addProduct(req, res) {
    try {
      const { cropName, price, quantity, location, description, image } = req.body;

      if (!cropName || !price || !quantity || !location) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      const productId = await Product.create({
        farmerId: req.userId,
        cropName,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        location,
        description,
        image: image || 'https://via.placeholder.com/300x300?text=' + cropName
      });

      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        productId
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProduct(req, res) {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getFarmerProducts(req, res) {
    try {
      const products = await Product.findByFarmerId(req.userId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllProducts(req, res) {
    try {
      const { search, location, minPrice, maxPrice } = req.query;

      const filters = {};
      if (search) filters.cropName = search;
      if (location) filters.location = location;
      if (minPrice) filters.minPrice = minPrice;
      if (maxPrice) filters.maxPrice = maxPrice;

      const products = await Product.findAll(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const updateData = req.body;

      const product = await Product.findById(productId);
      if (!product || product.farmerId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await Product.update(productId, updateData);
      res.json({ success: true, message: 'Product updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId);

      if (!product || product.farmerId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await Product.delete(productId);
      res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ProductController;
