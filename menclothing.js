// server.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');



// เปิดฐานข้อมูล
const db = new sqlite3.Database('./Data.db');
// Route สำหรับดึงข้อมูลสินค้า
function MensClothing(app){
    app.get('/products', (req, res) => {
        const category = req.query.category; // รับหมวดหมู่จาก query string
        const sql = category 
            ? 'SELECT * FROM products WHERE categories = ' 
            : 'SELECT * FROM products'; // หากไม่มีหมวดหมู่ ให้ดึงข้อมูลทั้งหมด
    
        db.all(sql, [categories], (err, rows) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.json(rows); // ส่งคืนข้อมูลในรูปแบบ JSON
        });
    });
    
}
module.exports = MensClothing;

