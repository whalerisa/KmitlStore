const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwtMiddleware = require("./jwtMiddleware");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// สร้างการเชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database("./Data.db");

function Address(app) {
  app.get("/product/:id", (req, res) => {
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

  app.post("/order", jwtMiddleware, (req, res) => {
    const userId = req.auth.id;
    const { productId, quantity } = req.body;

    // ดึงข้อมูลสินค้าจากฐานข้อมูล
    db.get(
      "SELECT id, name, price, categories, detail, image_url, stock FROM products WHERE id = ?",
      [productId],
      (err, product) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .send({ error: "Error fetching product details." });
        }
        if (!product) {
          return res.status(404).send({ error: "Product not found." });
        }

        // ตรวจสอบว่ามี stock เพียงพอต่อการสั่งซื้อหรือไม่
        if (product.stock < quantity) {
          return res
            .status(400)
            .send({ error: "Insufficient stock for the requested quantity." });
        }

        // บันทึกข้อมูลในตาราง MyOrder
        const orderQuery = `
                INSERT INTO MyOrder (product_id, user_id, status, price, product_name)
                VALUES (?, ?, ?, ?, ?)
            `;
        const orderParams = [
          productId,
          userId,
          "In Progress",
          product.price * quantity,
          product.name,
        ];

        db.run(orderQuery, orderParams, function (err) {
          if (err) {
            return res
              .status(500)
              .send({ error: "Error saving order details." });
          }

          // บันทึกใน sales_history โดยอิงตามข้อมูลจาก products
          const salesHistoryQuery = `
                    INSERT INTO sales_history (product_name, user_id, price, status, categories, detail, stock, image_url, product_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
          const salesHistoryParams = [
            product.name,
            userId,
            product.price * quantity,
            "available",
            product.categories,
            product.detail,
            quantity,
            product.image_url,
            product.id,
          ];

          db.run(salesHistoryQuery, salesHistoryParams, function (err) {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .send({ error: "Error saving sales history." });
            }

            // บันทึกข้อมูลลงในตาราง purchase_history
            const purchaseHistoryQuery = `
                        INSERT INTO purchase_history (product_id,product_name, status, user_id,quantity)
                        VALUES (?, ?, ?, ?, ?)
                    `;
            const purchaseHistoryParams = [productId,product.name, "Purchased", userId,quantity];

            db.run(purchaseHistoryQuery, purchaseHistoryParams, function (err) {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .send({ error: "Error saving purchase history." });
              }

              // อัปเดต stock ใน products table
              const updateStockQuery = `
                            UPDATE products SET stock = stock - ? WHERE id = ?
                        `;
              db.run(
                updateStockQuery,
                [quantity, productId],
                function (err) {
                  if (err) {
                    console.log(err);
                    return res
                      .status(500)
                      .send({ error: "Error updating stock." });
                  }

                  // จัดการ cart: ลดจำนวนใน cart หรือ ลบถ้าเหลือเพียง 0
                  db.get(
                    "SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?",
                    [userId, productId],
                    (err, cartItem) => {
                      if (err) {
                        console.log(err);
                        return res
                          .status(500)
                          .send({ error: "Error fetching cart data." });
                      }

                      if (!cartItem) {
                        return res.json({
                          message: "Order placed successfully",
                          orderId: this.lastID,
                        });
                      }

                      const remainingQuantity =
                        cartItem.quantity - quantity;

                      if (remainingQuantity > 0) {
                        // ลดจำนวนใน cart
                        const updateCartQuery = `
                                            UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?
                                        `;
                        db.run(
                          updateCartQuery,
                          [remainingQuantity, userId, productId],
                          function (err) {
                            if (err) {
                              console.log(err);
                              return res
                                .status(500)
                                .send({
                                  error: "Error updating cart quantity.",
                                });
                            }
                            res.json({
                              message: "Order placed successfully",
                              orderId: this.lastID,
                            });
                          }
                        );
                      } else {
                        // ลบรายการออกจาก cart
                        const deleteCartQuery = `
                                            DELETE FROM cart WHERE user_id = ? AND product_id = ?
                                        `;
                        db.run(
                          deleteCartQuery,
                          [userId, productId],
                          function (err) {
                            if (err) {
                              console.log(err);
                              return res
                                .status(500)
                                .send({ error: "Error deleting cart item." });
                            }
                            res.json({
                              message: "Order placed successfully",
                              orderId: this.lastID,
                            });
                          }
                        );
                      }
                    }
                  );
                }
              );
            });
          });
        });
      }
    );
  });
}

module.exports = Address;
