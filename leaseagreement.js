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
function LeaseAgreement(app){
    app.get('/products', (req, res) => {
        const sql = 'SELECT * FROM products WHERE categories = ?'; // ดึงข้อมูลทั้งหมดเป็นค่าเริ่มต้น
        const params = ['Lease Agreement'];

        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.json(rows); // ส่งคืนข้อมูลในรูปแบบ JSON
        });
    });
}

module.exports = LeaseAgreement;
