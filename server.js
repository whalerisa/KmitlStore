const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const register = require('./BackEnd/register'); // นำเข้า register
const login = require('./BackEnd/login'); 
const postproduct = require('./BackEnd/postproduct'); 
const homepage = require('./BackEnd/homepage'); 
const LeaseAgreement = require('./BackEnd/leaseagreement');
const MensClothing = require('./BackEnd/menclothing');
const Other = require('./BackEnd/other');
const SchoolSupplies = require('./BackEnd/schoolsupplies');
const Vehicle = require('./BackEnd/vehicle');
const WomensClothing = require('./BackEnd/womenclothing');
const Profile = require('./BackEnd/Profile');
const ProductDetail = require('./BackEnd/productdetail');
const My_Products = require('./BackEnd/my_products');
const sales_history = require('./BackEnd/Sales-history');




const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // เพิ่มขนาดสูงสุดที่อนุญาต
app.use(express.static(path.join(__dirname, '/'))); //Express ใช้ทุกโฟลเดอร์ที่อยู่ในroot ให้เป็นstatic files


// ตั้งค่าโฟลเดอร์ static สำหรับไฟล์ HTML, CSS และ JS
const staticFolders = ['Login','register','PostProduct','Home','Categories','Components','icons','BackEnd','Profile','Productdetails'
    ,'ImageOfProducts','My_Products','History'
];
staticFolders.forEach(folder => {
    app.use(express.static(path.join(__dirname,folder)));
}); 


// สร้างตารางถ้ายังไม่มี
const db = new sqlite3.Database('./Data.db', sqlite3.OPEN_READWRITE );
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
MensClothing(app);
Other(app);
SchoolSupplies(app);
Vehicle(app);
WomensClothing(app)
Profile(app);
ProductDetail(app);
My_Products(app);
sales_history(app);


// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
