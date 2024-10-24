const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, 'Address')));


// สร้างการเชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db');

function Address(app){
    app.get('/product/:id', (req, res) => {
        const productId = req.params.id;
        console.log('Fetching product with ID:', productId);  // ตรวจสอบค่า productId
        db.get('SELECT name, detail, price FROM products WHERE id = ?', [productId], (err, row) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: "Error fetching product details." });
            } else if (row) {
                res.json(row);  // ส่งข้อมูลสินค้าในรูปแบบ JSON
            } else {
                res.status(404).send({ error: "Product not found." });
            }
        });
    });
    
    

}
module.exports = Address;


