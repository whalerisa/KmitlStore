const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'homepage')));

const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to the Data database.');
    }
});

function homepage(app) {
    app.get('/products', (req, res) => {
        const sql = `
            SELECT id, image_url, name, detail, price
            FROM products
            WHERE stock > 0
        `;
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(rows); // ส่งข้อมูล products กลับไปในรูปแบบ JSON
        });
    });
}

module.exports = homepage;
