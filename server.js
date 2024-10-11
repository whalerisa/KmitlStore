const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const register = require('./register'); // นำเข้า register
const login = require('./login'); // นำเข้า login
const postproduct = require('./postproduct'); // นำเข้า login
const homepage = require('./homepage'); // นำเข้า login

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // เพิ่มขนาดสูงสุดที่อนุญาต


// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, 'Login')));
app.use(express.static(path.join(__dirname, 'register')));
app.use(express.static(path.join(__dirname, 'PostProduct')));
app.use(express.static(path.join(__dirname, 'homepage')));

// สร้างตารางถ้ายังไม่มี
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);
});

// นำเข้าระบบ Register และ Login
register(app);
login(app);
postproduct(app);
homepage(app);

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
