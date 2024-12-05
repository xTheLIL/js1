const express = require('express');
const createTables = require('./db/setup');  // Для создания таблиц
const pool = require('./db/index');          // Подключение к базе данных
const UserRouter = require('./Routers/UserRouter');  // Маршруты для пользователей
const ProductRouter = require('./Routers/ProductRouter');  // Маршруты для продуктов
const OrderRouter = require('./Routers/OrderRouter');  // Маршруты для заказов
const CartRouter = require('./Routers/CartRouter');  // Маршруты для корзины

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());  // Middleware для обработки JSON

// Подключаем маршруты
app.use('/api', UserRouter);
app.use('/api', ProductRouter);
app.use('/api', OrderRouter);
app.use('/api', CartRouter);

// Запуск сервера и создание таблиц
async function initializeApp() {
    try {
        await createTables(pool);  // Создание таблиц
        console.log('Tables created successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing app:', error.message);
    }
}

initializeApp();