const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// เปิดฐานข้อมูล
const db = new sqlite3.Database('./Data.db');

// Route สำหรับดึงข้อมูลสินค้า
function LeaseAgreement(app) {
    app.get('/lease-agreement', (req, res) => {
        const category = req.query.category || 'Lease Agreement'; // รับหมวดหมู่จาก query string หรือใช้ค่าเริ่มต้น
        const sql = 'SELECT * FROM products WHERE categories = ?'; // SQL Query

        db.all(sql, [category], (err, rows) => { // ใช้พารามิเตอร์ที่กำหนด
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.json(rows); // ส่งคืนข้อมูลในรูปแบบ JSON
        });
    });
}

module.exports = LeaseAgreement;
 