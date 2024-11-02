const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('./jwtMiddleware');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, 'Login')));

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the Data database.');
});

// POST route สำหรับ login
function login(app){
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
        }
    
        db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
            if (err) {
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล' });
            }
            if (row) {
               // สร้าง token
               const token = jwt.sign({ id: row.id }, process.env.JWT_SECRET, { expiresIn: '10h' });
               return res.json({ message: 'เข้าสู่ระบบสำเร็จ', token }); // ส่ง token กลับไป
            } else {
                return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
            }
        });
    });
}
module.exports = login;  // ส่งออกฟังก์ชัน login

// ในไฟล์ BackEnd/login.js หรือที่ที่คุณจัดการเกี่ยวกับการเข้าสู่ระบบ
app.get('/checkLogin', jwtMiddleware, (req, res) => {
    const userId = req.auth.id;
    return res.status(200).json({ message: 'Authorized', userId: userId });
});


