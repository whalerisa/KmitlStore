const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwtMiddleware = require("./jwtMiddleware");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// เชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database("./Data.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.message);
  } else {
    console.log("Cart to the Data database.");
  }
});

// เพิ่มสินค้าลงใน cart
function Cart(app) {
  app.post("/add-to-cart", jwtMiddleware, (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.auth.id;

    // ตรวจสอบค่าใน body
    if (!productId || !quantity) {
      return res.status(400).json({ message: "Missing productId or quantity" });
    }

    const checkCartQuery = `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`;
    db.get(checkCartQuery, [userId, productId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (row) {
        // If item exists, update the quantity
        const updateQuantityQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`;
        db.run(updateQuantityQuery, [quantity, userId, productId], (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: "Cart updated successfully" });
        });
      } else {
        // If item does not exist, insert a new entry
        const insertQuery = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
        db.run(insertQuery, [userId, productId, quantity], (err) => {
          if (err) {
            console.log(err)
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: "Item added to cart successfully" });
        });
      }
    });
  });

  // ดึงข้อมูลสินค้าใน cart มาแสดง
  app.get("/cart", jwtMiddleware, (req, res) => {
    const userId = req.auth.id; // ใช้ user id จาก token หลังจากตรวจสอบ JWT
    const query = `
    SELECT cart.product_id, products.image_url, products.name, products.price, cart.quantity 
    FROM cart 
    JOIN products ON cart.product_id = products.id 
    WHERE cart.user_id = ?
  `;

    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error("Error fetching cart data:", err);
        return res.status(500).send("Error fetching cart data");
      }
      res.json(rows);
    });
  });

  // ลบสินค้าใน cart
  app.delete("/cart/remove", jwtMiddleware, (req, res) => {
    const { productId } = req.body;
    const userId = req.auth.id;

    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    const deleteQuery = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;

    db.run(deleteQuery, [userId, productId], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // ตรวจสอบว่ามีการลบข้อมูลจริงหรือไม่
      if (this.changes > 0) {
        res.json({ message: "Item removed from cart successfully" });
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }
    });
  });
}
module.exports = Cart;
