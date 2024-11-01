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
    // เส้นทางสำหรับดึงข้อมูลประวัติการซื้อ
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
                users.username AS shop_name,
                users.id AS shop_id -- เพิ่ม id ของผู้ขาย
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
            res.json(rows); 
        });
    });
}
module.exports = Purchase_History;
