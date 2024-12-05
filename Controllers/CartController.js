const pool = require('../db');

class CartController {
    // Получение корзины пользователя
    async getCart(req, res) {
        const { user_id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM carts WHERE user_id = $1', [user_id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            const cart = result.rows[0];
            const cartItemsResult = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cart.id]);
            cart.items = cartItemsResult.rows;
            res.json(cart);
        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Добавление товара в корзину
    async addToCart(req, res) {
        const { user_id, product_id, quantity } = req.body;
        try {
            const cartResult = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [user_id]);
            let cart;
            if (cartResult.rows.length === 0) {
                cart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [user_id]);
            } else {
                cart = cartResult.rows[0];
            }
            const cartItemResult = await pool.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [cart.id, product_id, quantity]
            );
            res.status(201).json(cartItemResult.rows[0]);
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Удаление товара из корзины
    async removeFromCart(req, res) {
        const { cart_item_id } = req.params;
        try {
            const result = await pool.query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [cart_item_id]);
            if (!result.rows.length) {
                return res.status(404).json({ message: 'Cart item not found' });
            }
            res.json({ message: 'Item removed from cart' });
        } catch (error) {
            console.error('Error removing item from cart:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new CartController();