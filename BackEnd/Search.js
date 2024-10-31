const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./Data.db', (err) => {
    if (err) console.error('Failed to connect to the database:', err.message);
    else console.log('Connected to the Data database.');
});

function Search(app) {
    app.get('/search', (req, res) => {
        const searchQuery = req.query.query || '';
        const sql = `
            SELECT * FROM products
            WHERE stock > 0 AND name LIKE ?
        `;

        db.all(sql, [`%${searchQuery}%`], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });
}

module.exports = Search;
