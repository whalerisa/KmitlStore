const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const authenticateToken = require('./path-to-authenticateToken'); // ระบุ path ที่ถูกต้อง

const app = express();
app.use(cors());
app.use(bodyParser.json());

// สร้างการเชื่อมต่อกับฐานข้อมูล SQLite
const db = new sqlite3.Database('./Data.db');

function Address(app) {
    app.get('/product/:id', (req, res) => {
        const productId = req.params.id;
        db.get('SELECT name, detail, price FROM products WHERE id = ?', [productId], (err, row) => {
            if (err) {
                res.status(500).send({ error: "Error fetching product details." });
            } else if (row) {
                res.json(row);
            } else {
                res.status(404).send({ error: "Product not found." });
            }
        });
    });

    app.post('/order', authenticateToken, (req, res) => {
        const { productId, username, address, totalPayment } = req.body;

        // ดึงข้อมูลสินค้าจากฐานข้อมูล
        db.get('SELECT name, price FROM products WHERE id = ?', [productId], (err, product) => {
            if (err) {
                return res.status(500).send({ error: "Error fetching product details." });
            }
            if (!product) {
                return res.status(404).send({ error: "Product not found." });
            }

            const userId = req.user.userId; // ดึง userId จาก token

            // บันทึกข้อมูลในตาราง MyOrder
            const orderQuery = `
                INSERT INTO MyOrder (product_id, user_id, status, price, product_name)
                VALUES (?, ?, ?, ?, ?)
            `;
            const orderParams = [productId, userId, 'In Progress', product.price, product.name];

            db.run(orderQuery, orderParams, function (err) {
                if (err) {
                    return res.status(500).send({ error: "Error saving order details." });
                }

                // บันทึกใน sales_history
                const salesHistoryQuery = `
                    INSERT INTO sales_history (product_name, user_id)
                    VALUES (?, ?)
                `;
                const salesHistoryParams = [product.name, userId];

                db.run(salesHistoryQuery, salesHistoryParams, function (err) {
                    if (err) {
                        return res.status(500).send({ error: "Error saving sales history." });
                    }
                    res.json({ message: "Order placed successfully", orderId: this.lastID });
                });
            });
        });
    });
}

module.exports = Address;
