const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, "Product-details")));

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database("./Data.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.message);
  } else {
    console.log("Connected to the DB.");
  }
});

// ดึงข้อมูลสินค้า
function ProductDetail(app) {
  // ดึงข้อมูลสินค้าตาม ID
  app.get("/api/products/:id", (req, res) => {
    const { id } = req.params;
    console.log("Fetching product with ID:", id);
    // ดึงข้อมูลสินค้าและชื่อผู้ขายจากการ JOIN ตาราง products และ users
    const sql = `
            SELECT products.image_url, products.name, products.detail, products.price, products.stock, users.username, users.username, users.id AS userId
            FROM products 
            JOIN users ON products.userId = users.id 
            WHERE products.id = ?;
        `;

    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error("Error executing SQL query:", err.message); // แสดงข้อความข้อผิดพลาดใน Console
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json(row); 
    });
  });
}
module.exports = ProductDetail;
