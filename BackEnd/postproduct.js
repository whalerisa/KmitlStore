const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // ใช้สำหรับการอัปโหลดไฟล์
const jwt = require('jsonwebtoken'); // เพิ่ม jwt เพื่อใช้ตรวจสอบ token

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, 'PostProduct')));
app.use('/ImageOfProducts', express.static(path.join(__dirname, 'uploads'))); // เพิ่มเส้นทางสำหรับไฟล์รูปภาพ

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './ImageOfProducts'); // กำหนดโฟลเดอร์ที่เก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์เป็นเวลาเพื่อไม่ให้ซ้ำกัน
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // ตั้งขนาดสูงสุดของไฟล์เป็น 10MB
});


// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the products database.');
});

// สร้างตารางสินค้า ถ้ายังไม่มี
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        status TEXT NOT NULL,
        categories TEXT NOT NULL,
        detail TEXT NOT NULL,
        stock INTEGER NOT NULL,
        image_url TEXT
    )`);
});

// API สำหรับเพิ่มสินค้า พร้อมอัปโหลดรูปภาพ
function postproduct(app) {
    app.post('/addProduct', upload.single('image'), (req, res) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Please login first' });
        }

        jwt.verify(token, 'your_secret_key', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            const { name, price, status, categories, detail, stock } = req.body;
            const image_url = req.file ? `/ImageOfProducts/${req.file.filename}` : null;
            const userId = decoded.id;

            if (!name || !price || !status || !categories || !detail || !stock) {
                return res.status(400).json({ message: 'Incomplete information' });
            }

            // บันทึกข้อมูลสินค้าในฐานข้อมูล
            db.run(`INSERT INTO products (name, price, status, categories, detail, stock, image_url, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, price, status, categories, detail, stock, image_url, userId],
                function (err) {
                    if (err) {
                        console.error('Database error:', err.message);
                        return res.status(500).json({ message: 'Error adding product' });
                    }

                    // เพิ่มประวัติการขาย
                    const saleQuery = `INSERT INTO sales_history (user_id, product_name, status) VALUES (?, ?, ?)`;
                    const saleStatus = "Listed"; // สถานะการขายเริ่มต้น
                    db.run(saleQuery, [userId, name, saleStatus], function (err) {
                        if (err) {
                            return res.status(500).json({ message: 'Error adding sale history' });
                        }

                        res.json({ message: 'Product added successfully', id: this.lastID });
                    });
                });
        });
    });
}
module.exports = postproduct;

// API ดึงข้อมูลสินค้าทั้งหมด
app.get('/products', (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' });
        }
        res.json(rows);
    });
});

