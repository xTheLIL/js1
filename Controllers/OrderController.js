const pool = require('../db');

class OrderController {
    // Оформление нового заказа
    async createOrder(req, res) {
        const { user_id, cart_id } = req.body;

        try {
            // Находим все товары в корзине пользователя
            const cartItemsResult = await pool.query(
                'SELECT ci.product_id, ci.quantity, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1',
                [cart_id]
            );

            if (cartItemsResult.rows.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }

            // Рассчитываем общую сумму заказа
            let totalPrice = 0;
            const orderItems = [];
            cartItemsResult.rows.forEach(item => {
                totalPrice += item.quantity * item.price;
                orderItems.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                });
            });

            // Создание нового заказа
            const orderResult = await pool.query(
                'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING *',
                [user_id, totalPrice, 'pending']
            );
            const order = orderResult.rows[0];

            // Добавление товаров в заказ
            for (const orderItem of orderItems) {
                await pool.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                    [order.id, orderItem.product_id, orderItem.quantity, orderItem.price]
                );
            }

            // Очистка корзины пользователя
            await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cart_id]);

            res.status(201).json(order);
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Получение всех заказов пользователя
    async getUserOrders(req, res) {
        const { user_id } = req.params;

        try {
            // Получаем все заказы пользователя
            const result = await pool.query(
                'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
                [user_id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'No orders found' });
            }

            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Получение всех заказов для администратора
    async getAllOrders(req, res) {
        try {
            // Получаем все заказы
            const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching all orders:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Обновление статуса заказа (для администратора)
    async updateOrderStatus(req, res) {
        const { order_id } = req.params;
        const { status } = req.body;  // Новый статус заказа

        try {
            // Обновление статуса заказа
            const result = await pool.query(
                'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
                [status, order_id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new OrderController();