const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
      console.error('Error connecting to the database', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });  

app.use(cors());
app.use(bodyParser.json());

// ให้บริการไฟล์ static (HTML และ JS)
app.use(express.static(path.join(__dirname, 'Register')));

// สร้างตารางผู้ใช้
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT,
        password TEXT,
        phone TEXT
    )`);
});

// ระบบลงทะเบียน
app.post('/register', (req, res) => {
    const { username, email, password, phone } = req.body;
    const stmt = db.prepare('INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)');
    stmt.run(username, email, password, phone, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully!' });
    });
    stmt.finalize();
});

// ระบบเข้าสู่ระบบ
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Login successful!', user: row });
    });
});



// เริ่มเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
