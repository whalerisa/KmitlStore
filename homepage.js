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

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to the Data database.');
    }
});

// เส้นทาง API สำหรับดึงข้อมูลจากตาราง products
function homepage (app){
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
    
}
module.exports = homepage;




