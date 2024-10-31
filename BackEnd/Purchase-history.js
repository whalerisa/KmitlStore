const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwtMiddleware = require('./jwtMiddleware');

const app = express();
app.use(cors());
app.use(express.json()); // รองรับ JSON body

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

function Purchase_History(app) {
    // เส้นทางสำหรับบันทึกประวัติการซื้อ
    app.post('/purchase-history', jwtMiddleware, (req, res) => {
        const { product_id, product_name, status } = req.body;
        const userId = req.auth.id; // userId ที่มาจากผู้ซื้อที่ล็อกอิน

        const query = `
            INSERT INTO purchase_history (product_id, product_name, status, user_id)
            VALUES (?, ?, ?, ?)
        `;

        db.run(query, [product_id, product_name, status, userId], function(err) {
            if (err) {
                console.error('Error saving purchase history:', err.message);
                return res.status(500).json({ error: 'Failed to save purchase history' });
            }
            res.json({ message: 'Purchase history saved successfully' });
        });
    });

    app.get('/purchase-history', jwtMiddleware, (req, res) => {
        const userId = req.auth.id;
        console.log("User ID:", userId); // ตรวจสอบ userId ที่ได้รับจาก jwtMiddleware
    
        const query = `
            SELECT 
                purchase_history.product_name,
                purchase_history.status,
                purchase_history.quantity,
                products.image_url AS image,
                products.detail AS description, 
                products.price,
                users.username AS shop_name
            FROM 
                purchase_history
            JOIN 
                products ON purchase_history.product_id = products.id
            JOIN 
                users ON products.userId = users.id
            WHERE 
                purchase_history.user_id = ?;
        `;
    
        db.all(query, [userId], (err, rows) => {
            if (err) {
                console.error("Error fetching purchase history:", err);
                return res.status(500).json({ error: "Failed to fetch purchase history" });
            }
            console.log("Purchase history data:", rows); // ตรวจสอบข้อมูลที่ดึงมาได้
            res.json(rows); // ส่งข้อมูลประวัติการซื้อกลับไป
        });
    });
    
}

module.exports = Purchase_History;
