const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwtMiddleware = require('./jwtMiddleware');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database my products.');
});

function My_Products(app){
    app.get('/api/seller', jwtMiddleware, (req, res) => {
        const userId = req.auth.id;
        const sql = `
            SELECT 
                (SELECT COUNT(*) FROM products WHERE status = 'To Ship' AND userId = ?) AS toShip,
                (SELECT COUNT(*) FROM products WHERE status = 'In Transit' AND userId = ?) AS inTransit,
                (SELECT COUNT(*) FROM products WHERE status = 'Completed' AND userId = ?) AS completed
        `;
        db.get(sql, [userId, userId, userId], (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(row); // ส่งข้อมูลสถานะกลับไป
        });
    });
    

}
module.exports = My_Products;
