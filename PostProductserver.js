const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path'); // ใช้เพื่อระบุตำแหน่งไฟล์ static

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, 'PostProduct')));

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('products.db');

// สร้างตารางสินค้า ถ้ายังไม่มี
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        status TEXT NOT NULL,
        categories TEXT NOT NULL,
        detail TEXT NOT NULL,
        stock INTEGER NOT NULL
    )`);
});

// API สำหรับเพิ่มสินค้า
app.post('/addProduct', (req, res) => {
    console.log(req.body); // ตรวจสอบข้อมูลที่ได้รับ
    const { name, price, status, categories, detail, stock } = req.body;
    // ตรวจสอบข้อมูลเพิ่มเติมก่อนทำการบันทึก
    if (!name || !price || !status || !categories || !detail || !stock) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }

    db.run(`INSERT INTO products (name, price, status, categories, detail, stock) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, price, status, categories, detail, stock],
        function(err) {
            if (err) {
                console.log(err)
                return  res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' }); 
            }
            res.json({ message: 'เพิ่มสินค้าสำเร็จ', id: this.lastID });
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
