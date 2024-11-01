const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const jwtMiddleware = require("./jwtMiddleware");


const app = express();
const PORT = process.env.PORT || 3000;

// กำหนดที่เก็บไฟล์โปรไฟล์
const profilePicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './ProfilePic';
        // ตรวจสอบว่ามีโฟลเดอร์หรือไม่ ถ้าไม่มีให้สร้างใหม่
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // ตั้งชื่อไฟล์
    }
});

const upload = multer({ storage: profilePicStorage });


const db = new sqlite3.Database('Data.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

function ProfileEdit(app){
    // อัปเดตโปรไฟล์
    app.post('/api/updateProfile', jwtMiddleware, upload.single('profilePic'), (req, res) => {
        const userId = req.auth.id;
        const { username, phone, email } = req.body;
        const profilePicPath = req.file ? `${req.file.filename}` : null; // รับ path รูปโปรไฟล์
        // Update the user profile in the database
        const sql = `UPDATE users SET username = ?, phone = ?, email = ?, profile_pic = ? WHERE id = ?`;
        db.run(sql, [username, phone, email, profilePicPath, userId], function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Error updating profile');
            }
            res.json({ message: 'Profile updated successfully' });
        });
    });
    
}
module.exports = ProfileEdit;


