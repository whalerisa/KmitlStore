const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwtMiddleware = require('./jwtMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

function SellerCentre(app) {
    app.get('/api/seller', jwtMiddleware, (req, res) => {
        const sellerId = req.auth.id;

        const query = `
            SELECT 
                status,
                COUNT(*) AS count
            FROM MyOrder
            WHERE seller_id = ?
            GROUP BY status
        `;

        db.all(query, [sellerId], (err, rows) => {
            if (err) {
                console.error("Error fetching seller data:", err);
                return res.status(500).json({ error: "Failed to fetch seller data" });
            }

            const data = {
                Inprogress: 0,
                Completed: 0
            };

            rows.forEach(row => {
                if (row.status === 'In Progress') { // ตรงกับข้อมูลในฐานข้อมูล
                    data.Inprogress = row.count;
                } else if (row.status === 'Completed') {
                    data.Completed = row.count;
                }
            });

            res.json(data);
        });
    });
}

module.exports = SellerCentre;
