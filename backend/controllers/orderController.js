const Order = require('../models/Order');
const Product = require('../models/Product');
const Transport = require('../models/Transport');
const BlockchainRecord = require('../models/Blockchain');
const { Blockchain } = require('../blockchain/blockchain');
const QRCodeGenerator = require('../utils/qrCodeGenerator');

const blockchain = new Blockchain();

const OrderController = {
  async createOrder(req, res) {
    try {
      const { productId, quantity, deliveryAddress } = req.body;

      if (!productId || !quantity || !deliveryAddress) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (product.quantity < quantity) {
        return res.status(400).json({ error: 'Insufficient quantity' });
      }

      const totalPrice = product.price * quantity;
      const { id, orderId } = await Order.create({
        consumerId: req.userId,
        farmerId: product.farmerId,
        productId,
        quantity,
        totalPrice,
        deliveryAddress
      });

      // Add to blockchain
      const blockData = blockchain.addBlock(
        orderId,
        {
          farmerId: product.farmerId,
          farmerName: product.farmerName,
          farmerPhone: product.farmerPhone
        },
        {
          consumerId: req.userId,
          deliveryAddress
        },
        { status: 'pending' }
      );

      // Save blockchain record
      await BlockchainRecord.create({
        orderId,
        blockHash: blockData.hash,
        previousHash: blockData.previousHash,
        farmerInfo: JSON.stringify(blockData.farmerInfo),
        consumerInfo: JSON.stringify(blockData.consumerInfo),
        transportInfo: JSON.stringify(blockData.transportInfo)
      });

      // Generate QR Code
      const qrData = {
        orderId,
        productName: product.cropName,
        farmerId: product.farmerId,
        farmerName: product.farmerName,
        farmerPhone: product.farmerPhone,
        farmerEmail: product.farmerEmail,
        pickupLocation: product.location,
        deliveryLocation: deliveryAddress,
        quantity,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      try {
        const qrCode = await QRCodeGenerator.generateQRCode(qrData, orderId);
        await Order.updateQRCode(orderId, qrCode);
      } catch (qrError) {
        console.log('QR generation error (non-critical):', qrError.message);
      }

      // Update product quantity
      await Product.updateQuantity(productId, product.quantity - quantity);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        orderId,
        totalPrice
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const blockchainHistory = await BlockchainRecord.findByOrderId(orderId);

      res.json({ order, blockchainHistory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getConsumerOrders(req, res) {
    try {
      const orders = await Order.findByConsumerId(req.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getFarmerOrders(req, res) {
    try {
      const orders = await Order.findByFarmerId(req.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async assignTransporter(req, res) {
    try {
      const { orderId, transporterId } = req.body;
      const order = await Order.findById(orderId);

      if (!order || order.farmerId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await Order.assignTransporter(orderId, transporterId);

      await Transport.create({
        orderId,
        transporterId,
        pickupLocation: order.farmerPhone, // using phone as identifier
        deliveryLocation: order.deliveryAddress
      });

      await Order.updateStatus(orderId, 'assigned');

      res.json({ success: true, message: 'Transporter assigned' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async trackOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const transport = await Transport.findByOrderId(orderId);
      const blockchainHistory = await BlockchainRecord.findByOrderId(orderId);

      res.json({
        order,
        transport,
        blockchainHistory
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getQRCode(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);

      if (!order || order.qrCode === null) {
        return res.status(404).json({ error: 'QR code not found' });
      }

      const blockchainHistory = await BlockchainRecord.findByOrderId(orderId);

      res.json({
        qrCodeUrl: order.qrCode,
        orderDetails: {
          orderId: order.orderId,
          cropName: order.cropName,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          status: order.status,
          createdAt: order.createdAt
        },
        farmerDetails: {
          name: order.farmerName,
          email: order.farmerEmail,
          phone: order.farmerPhone
        },
        locationDetails: {
          pickupLocation: order.productLocation,
          deliveryLocation: order.deliveryAddress
        },
        supplyChain: {
          consumerName: order.consumerName,
          consumerEmail: order.consumerEmail,
          blockchainHistory
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = OrderController;
