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
    
        // คำสั่ง SQL สำหรับดึงข้อมูลผู้ขายจาก products พร้อมกับ username
        const queryProduct = `
            SELECT p.*, u.username 
            FROM products p 
            JOIN users u ON p.userId = u.id 
            WHERE p.userId = ?;
        `;
        
        // คำสั่ง SQL สำหรับดึงประวัติการขาย
        const querySalesHistory = `
            SELECT sh.*
            FROM sales_history sh 
            JOIN products p ON sh.product_id = p.id 
            WHERE sh.user_id = ?;
        `;
    
        // คำสั่ง SQL สำหรับดึงข้อมูลจากตาราง users
        const queryUserInfo = `
            SELECT username, profile_pic 
            FROM users 
            WHERE id = ?;
        `;
    
        // ดึงข้อมูลสินค้า
        db.all(queryProduct, [userId], (err, products) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
    
            // ดึงข้อมูลประวัติการขาย
            db.all(querySalesHistory, [userId], (err, salesHistory) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
    
                // ดึงข้อมูลจากตาราง users
                db.get(queryUserInfo, [userId], (err, userInfo) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
    
                    // ส่งข้อมูล products, salesHistory, และ userInfo กลับไป
                    res.json({ products, salesHistory, user: userInfo });
                });
            });
        });
    });

}
module.exports = ProfileShop;
