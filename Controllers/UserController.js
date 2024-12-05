const pool = require('../db');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await pool.query('SELECT * FROM users');
            res.json(users.rows);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async createUser(req, res) {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        try {
            const newUser = await pool.query(
                'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
                [name, email]
            );
            res.status(201).json(newUser.rows[0]);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new UserController();