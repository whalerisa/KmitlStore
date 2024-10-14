// server.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');



// เปิดฐานข้อมูล
const db = new sqlite3.Database('./Data.db');
// Route สำหรับดึงข้อมูลสินค้า
function MensClothing(app) {
    app.get('/products', (req, res) => {
        const category = req.query.category || 'Lease Agreement'; // รับหมวดหมู่จาก query string
        const sql = 'SELECT * FROM products WHERE categories = ?'; // กำหนดคำสั่ง SQL

        db.all(sql, [category], (err, rows) => { // ใช้ category เป็นพารามิเตอร์
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.json(rows); // ส่งคืนข้อมูลในรูปแบบ JSON
        });
    });
}

module.exports = MensClothing;

