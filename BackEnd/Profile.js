const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const jwtMiddleware = require("./jwtMiddleware");

app.use(cors());
app.use(express.json());
// ตั้งค่า static path สำหรับ ProfilePic
app.use("/ProfilePic", express.static("D:/KmitlStore/ProfilePic"));

// เชื่อมต่อกับฐานข้อมูล
const db = new sqlite3.Database("./Data.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database Profile.");
});

// API สำหรับดึงข้อมูลผู้ใช้
function Profile(app) {
  app.get("/users", jwtMiddleware, (req, res) => {
    const userId = req.auth.id;

    db.get(
      `SELECT username, phone, email, profile_pic FROM users WHERE id = ?`,
      [userId],
      (err, userRow) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
        }
        if (!userRow) {
          return res.status(404).json({ message: "ไม่พบผู้ใช้" });
        }

        // ดึงประวัติการซื้อ
        db.all(
          `SELECT product_name, status FROM purchase_history WHERE user_id = ?`,
          [userId],
          (err, purchaseRows) => {
            if (err) {
              console.error("Error in fetching purchase history:", err.message);
              return res
                .status(500)
                .json({ message: "เกิดข้อผิดพลาดในการดึงประวัติการซื้อ" });
            }

            const purchaseHistory = purchaseRows.length > 0 ? purchaseRows : [];

            // ดึงประวัติการขาย
            db.all(
              `SELECT product_name, status FROM sales_history WHERE user_id = ?`,
              [userId],
              (err, salesRows) => {
                if (err) {
                  console.error(
                    "Error in fetching sales history:",
                    err.message
                  );
                  return res
                    .status(500)
                    .json({ message: "เกิดข้อผิดพลาดในการดึงประวัติการขาย" });
                }

                const salesHistory = salesRows.length > 0 ? salesRows : [];

                // ส่งข้อมูลผู้ใช้ ประวัติการซื้อขาย และ path รูปโปรไฟล์ไปยัง frontend
                res.json({
                  user: {
                    ...userRow,
                    profile_pic: userRow.profile_pic,
                  },
                  purchaseHistory: purchaseHistory,
                  salesHistory: salesHistory,
                });
              }
            );
          }
        );
      }
    );
  });
}

module.exports = Profile;
