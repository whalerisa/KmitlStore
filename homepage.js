const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// เปิดใช้งาน CORS เพื่อให้ frontend สามารถดึงข้อมูลจาก backend ได้
app.use(cors());

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the Data database.');
});

// เส้นทาง API สำหรับดึงข้อมูลจากตาราง products
app.get('/products', (req, res) => {
    const sql = "SELECT image_url, name, detail, price FROM products";
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // ส่งข้อมูล products กลับไปในรูปแบบ JSON
        res.json(rows);
    });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
