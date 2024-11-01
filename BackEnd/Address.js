const express = require("express"); 
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwtMiddleware = require("./jwtMiddleware");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// สร้างการเชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database("./Data.db");

function Address(app) {
  app.get("/product/:id", (req, res) => { //ดึงproductตามid
    const productId = req.params.id;
    db.get(
      "SELECT name, detail, price FROM products WHERE id = ?",
      [productId],
      (err, row) => {
        if (err) {
          res.status(500).send({ error: "Error fetching product details." });
        } else if (row) {
          res.json(row);
        } else {
          res.status(404).send({ error: "Product not found." });
        }
      }
    );
  });

  app.post("/order", jwtMiddleware, (req, res) => { //สร้างคำสั่งซื้อ ใช้jwtMiddleware ตรวจสอบผู้ใช้
    const buyerId = req.auth.id; // ผู้ซื้อที่ล็อกอิน
    const { productId, quantity } = req.body;
  
    db.get(
      "SELECT id, name, price, categories, detail, image_url, stock, userId AS sellerId FROM products WHERE id = ?",
      [productId],
      (err, product) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ error: "Error fetching product details." });
        }
        if (!product) {
          return res.status(404).send({ error: "Product not found." });
        }
  
        if (product.stock < quantity) {
          return res.status(400).send({ error: "Insufficient stock for the requested quantity." });
        }
  
        const orderQuery = ` 
          INSERT INTO MyOrder (product_id, user_id, status, price, product_name, seller_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `;//บันทึกคำสั่งซื้อในตาราง
        const orderParams = [
          productId,
          buyerId,
          "In Progress",
          product.price * quantity,
          product.name,
          product.sellerId,  
        ];
  
        db.run(orderQuery, orderParams, function (err) { //runคำสั่งsql
          if (err) {
            return res.status(500).send({ error: "Error saving order details." });
          }
  
          const salesHistoryQuery = `
            INSERT INTO sales_history (product_name, user_id, price, status, categories, detail, stock, image_url, product_id, quantity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const salesHistoryParams = [
            product.name,
            product.sellerId, // ใช้ user_id ของผู้ขาย
            product.price * quantity,
            "available",
            product.categories,
            product.detail,
            product.stock,
            product.image_url,
            product.id,
            quantity,
          ];
  
          db.run(salesHistoryQuery, salesHistoryParams, function (err) {
            if (err) {
              console.log(err);
              return res.status(500).send({ error: "Error saving sales history." });
            }
  
            const purchaseHistoryQuery = `
              INSERT INTO purchase_history (product_id, product_name, status, user_id, quantity)
              VALUES (?, ?, ?, ?, ?)
            `;
            const purchaseHistoryParams = [productId, product.name, "Purchased", buyerId, quantity];

  
            db.run(purchaseHistoryQuery, purchaseHistoryParams, function (err) {
              if (err) {
                console.log(err);
                return res.status(500).send({ error: "Error saving purchase history." });
              }
  
              const updateStockQuery = `
                UPDATE products SET stock = stock - ? WHERE id = ?
              `;
              db.run(updateStockQuery, [quantity, productId], function (err) {
                if (err) {
                  console.log(err);
                  return res.status(500).send({ error: "Error updating stock." });
                }
  
                db.get( //จัดการตะกร้า
                  "SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?",
                  [buyerId, productId],
                  (err, cartItem) => {
                    if (err) {
                      console.log(err);
                      return res.status(500).send({ error: "Error fetching cart data." });
                    }
  
                    if (!cartItem) {
                      return res.json({
                        message: "Order placed successfully",
                        orderId: this.lastID,
                      });
                    }
  
                    const remainingQuantity = cartItem.quantity - quantity; //จำนวนที่เหลือในตะกร้า
  
                    if (remainingQuantity > 0) {
                      const updateCartQuery = `
                        UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?
                      `;
                      db.run(updateCartQuery, [remainingQuantity, buyerId, productId], function (err) { //updateตะกร้า
                        if (err) {
                          console.log(err);
                          return res.status(500).send({
                            error: "Error updating cart quantity.",
                          });
                        }
                        res.json({
                          message: "Order placed successfully",
                          orderId: this.lastID,
                        });
                      });
                    } else {
                      const deleteCartQuery = `
                        DELETE FROM cart WHERE user_id = ? AND product_id = ?
                      `;
                      db.run(deleteCartQuery, [buyerId, productId], function (err) { //deleteสินค้าในตะกร้า
                        if (err) {
                          console.log(err);
                          return res.status(500).send({ error: "Error deleting cart item." });
                        }
                        res.json({
                          message: "Order placed successfully",
                          orderId: this.lastID,
                        });
                      });
                    }
                  }
                );
              });
            });
          });
        });
      }
    );
  });
}

module.exports = Address;
