const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Data.db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
app.use(express.static(path.join(__dirname, 'Cart')));



function Cart(app){
    // เพิ่มสินค้าในตะกร้า
router.post('/add-to-cart', (req, res) => {
    const { userId, productId } = req.body;

    // ตรวจสอบว่าสินค้านี้มีอยู่ในตะกร้าแล้วหรือไม่
    const queryCheck = `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`;
    db.get(queryCheck, [userId, productId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (row) {
            // ถ้าสินค้านี้มีอยู่ในตะกร้าแล้ว ให้เพิ่มจำนวนสินค้า
            const newQuantity = row.quantity + 1;
            const updateQuery = `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`;
            db.run(updateQuery, [newQuantity, userId, productId], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update quantity' });
                }
                return res.json({ message: 'Quantity updated successfully' });
            });
        } else {
            // ถ้าไม่มีสินค้าชิ้นนี้ในตะกร้า ให้เพิ่มรายการใหม่
            const insertQuery = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
            db.run(insertQuery, [userId, productId, 1], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to add product to cart' });
                }
                return res.json({ message: 'Product added to cart successfully' });
            });
        }
    });
});
// ดึงข้อมูลสินค้าจากตะกร้าของผู้ใช้
router.get('/cart', (req, res) => {
    const userId = req.query.userId;

    const query = `
        SELECT products.id, products.name, products.image, products.price, cart.quantity
        FROM cart
        INNER JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json({ cartItems: rows });
    });
});
}
module.exports = Cart;




