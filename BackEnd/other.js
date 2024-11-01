const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const db = new sqlite3.Database('./Data.db');

// ดึงข้อมูลสินค้า
function Other(app) {
    app.get('/other', (req, res) => {
        const category = req.query.category || 'other'; 
        const sql = 'SELECT * FROM products WHERE categories = ? AND stock > 0'; 

        db.all(sql, [category], (err, rows) => { 
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.json(rows);
        });
    });
}

module.exports = Other;
 