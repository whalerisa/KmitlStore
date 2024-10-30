const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwtMiddleware = require('./jwtMiddleware');

const app = express();
app.use(cors());

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sales_history database.');
});

function Purchase_History(app) {
    // ตัวอย่างเส้นทางใน Backend
app.post('/purchase-history', jwtMiddleware, async (req, res) => {
    const { product_id, product_name, status } = req.body;
    const userId = req.auth.id;

    try {
        await db.run(
            'INSERT INTO purchase_history (product_id, product_name, status, user_id) VALUES (?, ?, ?, ?)',
            [product_id, product_name, status, userId]
        );
        res.json({ message: 'Purchase history saved successfully' });
    } catch (error) {
        console.error('Error saving purchase history:', error);
        res.status(500).json({ error: 'Failed to save purchase history' });
    }
});
}
module.exports = Sales_History;
