const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['farmer']), productController.addProduct);
router.get('/farmer', authMiddleware, roleMiddleware(['farmer']), productController.getFarmerProducts);
router.get('/all', productController.getAllProducts);
router.get('/:productId', productController.getProduct);
router.put('/:productId', authMiddleware, roleMiddleware(['farmer']), productController.updateProduct);
router.delete('/:productId', authMiddleware, roleMiddleware(['farmer']), productController.deleteProduct);

module.exports = router;
