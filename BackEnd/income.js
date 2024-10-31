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

function income (app){
    // API สำหรับดึงข้อมูลรายรับตาม seller_id
app.get('/income-overview', jwtMiddleware, (req, res) => {
    const sellerId = req.auth.id; // รับ seller_id จาก jwtMiddleware

    // สร้าง query เพื่อดึงยอดรวม In Progress และ Completed
    const querySummary = `
        SELECT 
            status,
            SUM(price) AS total
        FROM MyOrder
        WHERE seller_id = ?
        GROUP BY status
    `;

    // สร้าง query เพื่อดึงรายละเอียดรายรับเฉพาะที่ Completed
    const queryDetails = `
        SELECT 
            id AS order_id,
            product_name,
            status,
            price AS amount_transferred
        FROM MyOrder
        WHERE seller_id = ? AND status = 'Completed'
        
    `;

    // เรียกใช้ฐานข้อมูลเพื่อดึงข้อมูล summary ของ In Progress และ Completed
    db.all(querySummary, [sellerId], (err, summaryRows) => {
        if (err) {
            console.error("Error fetching income summary:", err);
            return res.status(500).json({ error: "Failed to fetch income summary" });
        }

        // เรียกใช้ฐานข้อมูลเพื่อดึงข้อมูลรายละเอียดเฉพาะที่ Completed
        db.all(queryDetails, [sellerId], (err, detailRows) => {
            if (err) {
                console.error("Error fetching income details:", err);
                return res.status(500).json({ error: "Failed to fetch income details" });
            }

            // แยกข้อมูล summary เป็น In Progress และ Completed
            const summary = {
                inProgress: 0,
                completed: 0
            };
            summaryRows.forEach(row => {
                if (row.status === 'In Progress') {
                    summary.inProgress = row.total || 0;
                } else if (row.status === 'Completed') {
                    summary.completed = row.total || 0;
                }
            });

            // ส่งข้อมูล summary และรายละเอียดกลับไป
            res.json({
                summary,
                details: detailRows
            });
        });
    });
});

}
module.exports = income;



