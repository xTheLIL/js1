const express = require('express');
const ProductController = require('../Controllers/ProductController');
const router = express.Router();

// Получение всех товаров
router.get('/products', ProductController.getAllProducts);

// Получение товара по ID
router.get('/products/:id', ProductController.getProductById);

// Создание товара (только для администратора)
router.post('/products', ProductController.createProduct);

// Обновление товара (только для администратора)
router.put('/products/:id', ProductController.updateProduct);

// Удаление товара (только для администратора)
router.delete('/products/:id', ProductController.deleteProduct);

module.exports = router;