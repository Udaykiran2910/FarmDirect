const express = require('express');
const orderController = require('../controllers/orderController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// More specific routes FIRST
router.get('/consumer/all', authMiddleware, roleMiddleware(['consumer']), orderController.getConsumerOrders);
router.get('/farmer/all', authMiddleware, roleMiddleware(['farmer']), orderController.getFarmerOrders);
router.get('/track/:orderId', authMiddleware, orderController.trackOrder);
router.get('/qr/:orderId', orderController.getQRCode);
router.post('/assign-transporter', authMiddleware, roleMiddleware(['farmer']), orderController.assignTransporter);

// Generic routes LAST
router.post('/', authMiddleware, roleMiddleware(['consumer']), orderController.createOrder);
router.get('/:orderId', authMiddleware, orderController.getOrder);

module.exports = router;
