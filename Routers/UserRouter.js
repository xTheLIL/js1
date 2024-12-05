const express = require('express');
const UserController = require('../Controllers/UserController');
const router = express.Router();

// Маршруты для пользователей
router.get('/users', UserController.getAllUsers);  // Получение всех пользователей
router.post('/users', UserController.createUser); // Создание нового пользователя

module.exports = router;