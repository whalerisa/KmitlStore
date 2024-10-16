const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, 'Product-details')));

// เปิดการเชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database(path.join(__dirname, './Data.db'));

// API Endpoint สำหรับดึงข้อมูลสินค้า
function ProductDetail(app){
    // API สำหรับดึงข้อมูลสินค้าตาม ID
    app.get('/api/products/:id', (req, res) => {
        const { id } = req.params;
        const sql = 'SELECT image_url, name, detail, price,stock FROM products WHERE id = ?';
        
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!row) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            // ส่งข้อมูลสินค้าไปยัง frontend
            res.json(row);
        });
    });
    
}
module.exports = ProductDetail;



