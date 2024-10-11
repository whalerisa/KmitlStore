const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('products.db');

// สร้างตารางสินค้า (ถ้ายังไม่มี)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        status TEXT NOT NULL
    )`);
});

// ฟังก์ชันสร้างรหัสสินค้าสุ่ม
function generateRandomId() {
    return Math.floor(Math.random() * 1000000); // สุ่มรหัสระหว่าง 0 - 999999
}

// API เพิ่มสินค้า
app.post('/addProduct', (req, res) => {
    const { name, price, status } = req.body;
    const id = generateRandomId();

    db.run(`INSERT INTO products (id, name, price, status) VALUES (?, ?, ?, ?)`, [id, name, price, status], (err) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' });
        }
        res.json({ message: 'เพิ่มสินค้าสำเร็จ', id });
    });
});

// API ดึงข้อมูลสินค้าทั้งหมด
app.get('/products', (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' });
        }
        res.json(rows);
    });
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});