const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const register = require('./register'); 
const login = require('./login'); // นำเข้า login
const postproduct = require('./postproduct'); 
const homepage = require('./homepage'); 
const LeaseAgreement = require('./leaseagreement');




const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // เพิ่มขนาดสูงสุดที่อนุญาต
app.use(express.static(path.join(__dirname, '/'))); //Express ใช้ทุกโฟลเดอร์ที่อยู่ในroot ให้เป็นstatic files



// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
const staticFolders = ['Login','register','PostProduct','Home','Categories','Components','icons'];
staticFolders.forEach(folder => {
    app.use(express.static(path.join(__dirname,folder)));
});


// สร้างตารางถ้ายังไม่มี
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);
});

// นำเข้าระบบ 
register(app);
login(app);
postproduct(app);
homepage(app);
LeaseAgreement(app);

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
