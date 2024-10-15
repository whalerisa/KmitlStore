// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, 'LeaseAgreement')));

// เปิดฐานข้อมูล
const db = new sqlite3.Database('./Data.db');
// Route สำหรับดึงข้อมูลสินค้า
function MensClothing(app) {
    app.get('/lease-agreement', (req, res) => {
        const sql = 'SELECT * FROM products WHERE categories = ?'; // กำหนดคำสั่ง SQL

        db.all(sql, ['Lease Agreement'], (err, rows) => { // ใช้ category เป็นพารามิเตอร์
            if (err) {
                console.error('Database error:', err); // Log ข้อผิดพลาดใน console
                res.status(500).send(err.message);
                return;
            }
            res.json(rows); // ส่งคืนข้อมูลในรูปแบบ JSON
        });
    });
}

module.exports = MensClothing;

