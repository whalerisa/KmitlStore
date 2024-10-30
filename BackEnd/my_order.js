const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwtMiddleware = require('./jwtMiddleware'); // ตรวจสอบ Token
const app = express();

app.use(cors());
app.use(express.json());

// เชื่อมต่อกับฐานข้อมูล
const db = new sqlite3.Database('./Data.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

function MyOrder(app) {
    // API สำหรับดึงข้อมูลคำสั่งซื้อทั้งหมดที่เกี่ยวข้องกับ seller_id ของผู้ขายที่ล็อกอินอยู่
    app.get('/my-orders', jwtMiddleware, (req, res) => {
        const sellerId = req.auth.id; // ดึง seller_id ของผู้ขายที่ล็อกอินอยู่จาก jwtMiddleware

        const query = `SELECT id, product_name AS name, price, status FROM MyOrder WHERE seller_id = ?`;
        db.all(query, [sellerId], (err, rows) => {
            if (err) {
                console.error('Error fetching orders:', err.message);
                return res.status(500).json({ error: 'Failed to fetch orders' });
            }
            res.json(rows || []); // ถ้าไม่มีข้อมูล ให้ส่งอาร์เรย์เปล่ากลับไป
        });
    });

    // API สำหรับอัปเดตสถานะคำสั่งซื้อ
    app.patch('/my-orders/:id', jwtMiddleware, (req, res) => {
        const orderId = req.params.id;
        const newStatus = req.body.status;
        const sellerId = req.auth.id; // ดึง seller_id ของผู้ขายที่ล็อกอินอยู่จาก jwtMiddleware

        const updateQuery = `UPDATE MyOrder SET status = ? WHERE id = ? AND seller_id = ?`;
        db.run(updateQuery, [newStatus, orderId, sellerId], function(err) {
            if (err) {
                console.error('Error updating order status:', err.message);
                return res.status(500).json({ error: 'Failed to update order status' });
            }
            res.json({ message: 'Order status updated successfully' });
        });
    });
}

module.exports = MyOrder;
