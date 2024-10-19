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
    app.get('/api/seller', authenticateToken, (req, res) => {
        const sql = `
            SELECT 
                (SELECT COUNT(*) FROM products WHERE status = 'To Ship' AND userId = ?) AS toShip,
                (SELECT COUNT(*) FROM products WHERE status = 'In Transit' AND userId = ?) AS inTransit,
                (SELECT COUNT(*) FROM products WHERE status = 'Completed' AND userId = ?) AS completed
        `;
        db.get(sql, [req.userId, req.userId, req.userId], (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(row); // ส่งข้อมูลสถานะกลับไป
        });
    });
    

}
module.exports = My_Products;
