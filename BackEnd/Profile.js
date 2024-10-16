// เชื่อมต่อกับฐานข้อมูล SQLite
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken'); // ต้องติดตั้ง jwt ด้วย npm install jsonwebtoken

app.use(cors());
app.use(express.json());

// เชื่อมต่อกับฐานข้อมูล
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

// API สำหรับดึงข้อมูลผู้ใช้
function Profile(app){
    app.get('/users', (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // ดึง token จาก Authorization header
        
        if (!token) {
            return res.status(401).json({ message: 'ไม่ได้รับ token' });
        }
    
        // ตรวจสอบ token และถอดรหัส
        jwt.verify(token, 'your_secret_key', (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token ไม่ถูกต้อง' });
            }
    
            const userId = decoded.id; // ดึง id จาก token ที่ถอดรหัสได้ (ในตาราง users คือ id)
    
            // ใช้ `id` แทนการใช้ `userId`
            db.get(`SELECT username, phone, email FROM users WHERE id = ?`, [userId], (err, row) => {
                if (err) {
                    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
                }
                if (!row) {
                    return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
                }
                res.json(row); // ส่งข้อมูลผู้ใช้กลับไปยัง frontend
            });
        });
    });
    
}
module.exports = Profile;


