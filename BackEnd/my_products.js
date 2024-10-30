const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwtMiddleware = require("./jwtMiddleware");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./Data.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database my products.");
});

function My_Products(app) {
  // API สำหรับดึงข้อมูลสินค้าของผู้ใช้ที่ล็อกอิน
  app.get("/api/products", jwtMiddleware, (req, res) => {
    const userId = req.auth.id;
    console.log("User ID:", userId); // ดูว่าได้ userId ถูกต้องหรือไม่
    const sql = "SELECT id, name, price, status, userId FROM products WHERE userId = ?";

    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.error("Error executing SQL query:", err.message);
        return res.status(500).json({ error: err.message });
      }
      if (rows.length === 0) {
        return res.status(404).json({ error: "No products found for this user" });
      }
      res.json(rows); // ส่งข้อมูลสินค้าทั้งหมดกลับไป
    });
  });

  // API สำหรับลบสินค้าตาม productId จากทุกตารางที่เกี่ยวข้อง
  app.delete("/api/products/:id", jwtMiddleware, (req, res) => {
    const userId = req.auth.id;
    const productId = req.params.id;

    // ลบสินค้าจากตาราง products, sales_history, purchase_history, และ cart
    const deleteProductSQL = "DELETE FROM products WHERE id = ? AND userId = ?";
    const deleteSalesHistorySQL = "DELETE FROM sales_history WHERE product_id = ? AND user_id = ?";
    const deletePurchaseHistorySQL = "DELETE FROM purchase_history WHERE product_id = ? AND user_id = ?";
    const deleteCartSQL = "DELETE FROM cart WHERE product_id = ? AND user_id = ?";

    // เริ่มต้นการลบในแต่ละตาราง
    db.run(deleteProductSQL, [productId, userId], function (err) {
      if (err) {
        console.error("Error deleting from products:", err.message);
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({
          error: "Product not found or you do not have permission to delete",
        });
      }

      // ลบจาก sales_history
      db.run(deleteSalesHistorySQL, [productId, userId], function (err) {
        if (err) {
          console.error("Error deleting from sales_history:", err.message);
        }

        // ลบจาก purchase_history
        db.run(deletePurchaseHistorySQL, [productId, userId], function (err) {
          if (err) {
            console.error("Error deleting from purchase_history:", err.message);
          }

          // ลบจาก cart
          db.run(deleteCartSQL, [productId, userId], function (err) {
            if (err) {
              console.error("Error deleting from cart:", err.message);
            }

            // ส่งผลลัพธ์การลบสำเร็จกลับไป
            res.json({ success: true, message: "Product deleted from all related tables successfully" });
          });
        });
      });
    });
  });
}

module.exports = My_Products;
