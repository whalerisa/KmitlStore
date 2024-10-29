const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// สร้างการเชื่อมต่อกับฐานข้อมูล
const db = new sqlite3.Database('./Data.db');


function ProfileShop(app){
    // API สำหรับดึงข้อมูลผู้ขายและประวัติการขาย
app.get('/api/shop/:userId', (req, res) => {
    const userId = req.params.userId;

    // คำสั่ง SQL สำหรับดึงข้อมูลผู้ขาย
    const queryProduct = `
        SELECT p.*, u.username 
        FROM products p 
        JOIN users u ON p.userId = u.id 
        WHERE p.userId = ?;
    `;
    
    // คำสั่ง SQL สำหรับดึงประวัติการขาย
    const querySalesHistory = `
        SELECT sh.*, p.product_name 
        FROM sales_history sh 
        JOIN products p ON sh.productId = p.id 
        WHERE sh.user_id = ?;
    `;

    db.all(queryProduct, [userId], (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.all(querySalesHistory, [userId], (err, salesHistory) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ products, salesHistory });
        });
    });
});

}
module.exports = ProfileShop;
