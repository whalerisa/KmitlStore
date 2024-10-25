const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');

const app = express();
const dbPath = path.resolve(__dirname, '../Data.db');
const db = new sqlite3.Database(dbPath);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Static folder for images

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_pics');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

function ProFileEdit(app){
    // Update profile information
app.put('/profile/updateProfile', (req, res) => {
    const { userId, name, phone, email } = req.body;
    const query = `UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?`;

    db.run(query, [name, phone, email, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: "Failed to update profile." });
        }
        res.status(200).json({ message: "Profile updated successfully." });
    });
});

// Update profile picture
app.put('/profile/updateProfilePic', upload.single('profilePic'), (req, res) => {
    const { userId } = req.body;
    const profilePic = req.file.filename; // multer saves file name in req.file
    const query = `UPDATE users SET profile_pic = ? WHERE id = ?`;

    db.run(query, [profilePic, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: "Failed to update profile picture." });
        }
        res.status(200).json({ Promessage: "Profile picture updated successfully." });
    });
});


}
module.exports = ProFileEdit;


