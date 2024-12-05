const express = require('express');
const OrderController = require('../Controllers/OrderController');
const router = express.Router();

// Оформление нового заказа
router.post('/orders', OrderController.createOrder);

// Получение всех заказов пользователя
router.get('/orders/:user_id', OrderController.getUserOrders);

// Получение всех заказов для администратора
router.get('/orders', OrderController.getAllOrders);

// Обновление статуса заказа (для администратора)
router.put('/orders/:order_id/status', OrderController.updateOrderStatus);

module.exports = router;