const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwt = require('jsonwebtoken'); // นำเข้า library สำหรับ JWT

const app = express();
app.use(cors());

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sales_history database.');
});

function Sales_History(app) {
    // API ดึงข้อมูลจากตาราง sales_history
    app.get('/sales-history', (req, res) => {
        const token = req.headers['authorization']; // รับ Token จาก header

        if (!token) {
            return res.status(403).json({ error: 'No token provided' }); // ถ้าไม่มี Token ให้ส่ง error
        }

        // ตรวจสอบ Token
        jwt.verify(token, 'your_secret_key', (err, decoded) => { // เปลี่ยน 'your_secret_key' เป็น secret ของคุณ
            if (err) {
                return res.status(401).json({ error: 'Failed to authenticate token' }); // ถ้า Token ไม่ถูกต้อง
            }

            const userId = decoded.id; // ดึง userId จาก decoded Token

            const query = `
                SELECT sales_history.product_name, sales_history.price, sales_history.detail AS description, 
                       sales_history.image_url AS image, users.username AS shop_name
                FROM sales_history
                JOIN users ON sales_history.user_id = users.id
                WHERE sales_history.user_id = ?  -- ดึงข้อมูลเฉพาะของผู้ใช้
            `;

            db.all(query, [userId], (err, rows) => {
                if (err) {
                    console.error('SQL Error:', err); // แสดงข้อผิดพลาด
                    return res.status(500).json({ error: 'Error fetching sales history' });
                }
                res.json(rows); // ส่งข้อมูลกลับ
            });
        });
    });
}
module.exports = Sales_History;
