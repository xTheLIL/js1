const express = require('express');
const CartController = require('../Controllers/CartController');
const router = express.Router();

// Получение корзины пользователя по user_id
router.get('/carts/:user_id', CartController.getCart);

// Добавление товара в корзину
router.post('/carts', CartController.addToCart);

// Удаление товара из корзины
router.delete('/carts/items/:cart_item_id', CartController.removeFromCart);

module.exports = router;