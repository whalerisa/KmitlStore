const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // แก้ไขให้ตรงกับคีย์ของคุณ


// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to the DB salehistory.');
    }
});
// Middleware สำหรับตรวจสอบ token
app.get('sales-history',req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token required' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.userId = user.id; 
        next();
    });
    // Route สำหรับดึงข้อมูล sales history
    db.get(`SELECT username, phone, email FROM users WHERE id = ?`, [userId], (err, userRow) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
        }
    router.get('/sales-history', authenticateToken, (req, res) => {
        const userId = req.userId; // ดึง userId จาก request

        const query = `SELECT * FROM sales_history WHERE user_id = ?`;
        
        db.all(query, [userId], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(rows); // ส่งข้อมูลไปยัง client
        });
    });
}
function sales_history(app){

}
module.exports = sales_history;
