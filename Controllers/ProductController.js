const pool = require('../db');

class ProductController {
    // Получение всех товаров
    async getAllProducts(req, res) {
        try {
            const result = await pool.query('SELECT * FROM products');
            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Получение товара по ID
    async getProductById(req, res) {
        const { id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
            const product = result.rows[0];
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Создание нового товара (для администратора)
    async createProduct(req, res) {
        const { name, description, price, stock_quantity } = req.body;
        try {
            const result = await pool.query(
                'INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, description, price, stock_quantity]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Обновление товара (для администратора)
    async updateProduct(req, res) {
        const { id } = req.params;
        const { name, description, price, stock_quantity } = req.body;
        try {
            const result = await pool.query(
                'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4 WHERE id = $5 RETURNING *',
                [name, description, price, stock_quantity, id]
            );
            const product = result.rows[0];
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Удаление товара (для администратора)
    async deleteProduct(req, res) {
        const { id } = req.params;
        try {
            const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
            const product = result.rows[0];
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new ProductController();
