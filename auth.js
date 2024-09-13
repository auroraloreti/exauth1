const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();


router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User registered', user: results.rows[0] });
  });
});


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  pool.query('SELECT * FROM users WHERE username = $1', [username], async (err, results) => {
    if (err || results.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1h' });

    pool.query('UPDATE users SET token = $1 WHERE id = $2', [token, user.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save token' });
      }
      res.json({ message: 'Logged in successfully', token });
    });
  });
});

module.exports = router;