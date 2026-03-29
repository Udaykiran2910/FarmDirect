const Transport = require('../models/Transport');
const Order = require('../models/Order');
const BlockchainRecord = require('../models/Blockchain');

const TransportController = {
  async getAssignedDeliveries(req, res) {
    try {
      const deliveries = await Transport.findByTransporterId(req.userId);
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateDeliveryStatus(req, res) {
    try {
      const { transportId } = req.params;
      const { status, latitude, longitude } = req.body;

      if (!['picked', 'in_transit', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      let transport = await Transport.findById(transportId);
      if (!transport || transport.transporterId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await Transport.updateStatus(transportId, status);

      if (latitude && longitude) {
        await Transport.updateLocation(transportId, latitude, longitude);
      }

      // Update order status
      const statusMap = {
        'picked': 'picked',
        'in_transit': 'in_transit',
        'completed': 'delivered'
      };

      await Order.updateStatus(transport.orderId, statusMap[status]);

      // Update blockchain
      const blockchainRecords = await BlockchainRecord.findByOrderId(transport.orderId);
      if (blockchainRecords.length > 0) {
        const latestRecord = blockchainRecords[blockchainRecords.length - 1];
        const updatedTransportInfo = JSON.stringify({
          status: status,
          latitude: latitude || null,
          longitude: longitude || null,
          transporterName: transport.transporterName,
          transporterPhone: transport.transporterPhone
        });

        await BlockchainRecord.updateTransportInfo(latestRecord.id, updatedTransportInfo);
      }

      res.json({ success: true, message: 'Delivery status updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getDeliveryDetails(req, res) {
    try {
      const { transportId } = req.params;
      const transport = await Transport.findById(transportId);

      if (!transport || transport.transporterId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      res.json(transport);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateLocation(req, res) {
    try {
      const { transportId } = req.params;
      const { latitude, longitude } = req.body;

      let transport = await Transport.findById(transportId);
      if (!transport || transport.transporterId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await Transport.updateLocation(transportId, latitude, longitude);

      res.json({ success: true, message: 'Location updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = TransportController;
