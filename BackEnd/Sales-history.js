const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const jwtMiddleware = require("./jwtMiddleware");

const app = express();
app.use(cors());

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database("./Data.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the sales_history database.");
});

function Sales_History(app) {
  // API ดึงข้อมูลจากตาราง sales_history
  app.get("/sales-history", jwtMiddleware, (req, res) => {
    const userId = req.auth.id;
    const query = `
      SELECT sales_history.product_name, sales_history.price, 
             sales_history.detail AS description, 
             sales_history.image_url AS image, 
             users.username AS shop_name
      FROM sales_history
      JOIN users ON sales_history.user_id = users.id
      WHERE sales_history.user_id = ? -- ดึงข้อมูลเฉพาะของผู้ขายที่ล็อกอิน
    `;

    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error("SQL Error:", err); // แสดงข้อผิดพลาด
        return res.status(500).json({ error: "Error fetching sales history" });
      }
      res.json(rows); // ส่งข้อมูลกลับ
    });
  });
}

module.exports = Sales_History;
