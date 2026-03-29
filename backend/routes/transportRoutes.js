const express = require('express');
const transportController = require('../controllers/transportController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/deliveries', authMiddleware, roleMiddleware(['transporter']), transportController.getAssignedDeliveries);
router.get('/:transportId', authMiddleware, roleMiddleware(['transporter']), transportController.getDeliveryDetails);
router.put('/:transportId/status', authMiddleware, roleMiddleware(['transporter']), transportController.updateDeliveryStatus);
router.put('/:transportId/location', authMiddleware, roleMiddleware(['transporter']), transportController.updateLocation);

module.exports = router;
