const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, 'homepage'))); 

// Route สำหรับดึงข้อมูลผลิตภัณฑ์
function homepage(app){
    app.get('/products', (req, res) => {
        const sql = 'SELECT * FROM products';
        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    });
    
    // Route สำหรับไฟล์ homepage.html
    app.get('/homepage.html', (req, res) => {
        res.sendFile(path.join(__dirname, 'Home', 'homepage.html')); // เปลี่ยนที่อยู่ให้ถูกต้อง
    });
}
module.exports = homepage;

// สร้างการเชื่อมต่อกับฐานข้อมูล
const db = new sqlite3.Database('./Data.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// ปิดการเชื่อมต่อฐานข้อมูลเมื่อเซิร์ฟเวอร์หยุดทำงาน
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});