const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database my products.');
});

const SECRET_KEY = 'your_secret_key'; // ใช้ secret key เดียวกันสำหรับการตรวจสอบ

// Middleware สำหรับตรวจสอบ JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // ดึง token จาก "Bearer <token>"

    if (!token) return res.status(401).json({ error: 'Token required' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        req.userId = user.userId; // ดึง userId จาก token แล้วเก็บใน request object
        next();
    });
}


function My_Products(app){
        // API สำหรับดึงข้อมูลสินค้าของผู้ใช้ที่ล็อกอิน
    app.get('/api/products', authenticateToken, (req, res) => {
        const sql = 'SELECT id, name, price, status FROM products WHERE userId = ?';  // ดึงข้อมูลสินค้าโดยใช้ userId
        db.all(sql, [req.userId], (err, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err.message);
                return res.status(500).json({ error: err.message });
            }
            if (rows.length === 0) {
                return res.status(404).json({ error: 'No products found for this user' });
            }
            res.json(rows); // ส่งข้อมูลสินค้าทั้งหมดกลับไป
        });
    });
    // API สำหรับลบสินค้าตาม productId
    app.delete('/api/products/:id', authenticateToken, (req, res) => {
        const productId = req.params.id;
        const sql = 'DELETE FROM products WHERE id = ? AND userId = ?';  // ลบสินค้าตาม id และ userId
        db.run(sql, [productId, req.userId], function(err) {
            if (err) {
                console.error('Error executing SQL delete:', err.message);
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Product not found or you do not have permission to delete' });
            }
            res.json({ success: true, message: 'Product deleted successfully' });
        });
    });


}
module.exports = My_Products;
