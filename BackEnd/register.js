const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, 'register')));

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the products database.');  
});

// สร้างตารางถ้ายังไม่มี
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);
});

// POST route สำหรับ register
// ใน RegisterServer.js
function register(app) {
    app.post('/register', (req, res) => {
        const { username, email, password, phone } = req.body;
        console.log(req.body); // ตรวจสอบข้อมูลที่ได้รับ
        
        // ตรวจสอบข้อมูลเพิ่มเติมก่อนการบันทึก
        if (!username || !email || !password || !phone) {
            return res.status(400).send('ใส่ข้อมูลไม่ครบ');
        }

        // ตรวจสอบว่า username ซ้ำกันหรือไม่
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบชื่อผู้ใช้' });
            }

            if (row) {
                // หากมีข้อมูล username อยู่ในฐานข้อมูล
                return res.status(400).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
            } else {
                // ถ้า username ไม่ซ้ำ ทำการบันทึกข้อมูล
                db.run(`INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)`,
                    [username, email, password, phone],
                    function(err) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
                        }
                        res.send({ message: 'ลงทะเบียนสำเร็จ', id: this.lastID });
                    });
            }
        });
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบอีเมลล์ผู้ใช้' });
            }

            if (row) {
                // หากมีข้อมูล username อยู่ในฐานข้อมูล
                return res.status(400).json({ message: 'อีเมลล์นี้ถูกใช้งานแล้ว' });
            } else {
                // ถ้า username ไม่ซ้ำ ทำการบันทึกข้อมูล
                db.run(`INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)`,
                    [username, email, password, phone],
                    function(err) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
                        }
                        res.send({ message: 'ลงทะเบียนสำเร็จ', id: this.lastID });
                    });
            }
        });
        db.get(`SELECT * FROM users WHERE phone = ?`, [email], (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบเบอร์โทรผู้ใช้' });
            }

            if (row) {
                // หากมีข้อมูล username อยู่ในฐานข้อมูล
                return res.status(400).json({ message: 'เบอร์นี้ถูกใช้งานแล้ว' });
            } else {
                // ถ้า username ไม่ซ้ำ ทำการบันทึกข้อมูล
                db.run(`INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)`,
                    [username, email, password, phone],
                    function(err) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
                        }
                        res.send({ message: 'ลงทะเบียนสำเร็จ', id: this.lastID });
                    });
            }
        });
    });
}
module.exports = register;  // ส่งออกฟังก์ชัน register

// API ดึงข้อมูลuserทั้งหมด
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' });
        }
        res.json(rows);
    });
});