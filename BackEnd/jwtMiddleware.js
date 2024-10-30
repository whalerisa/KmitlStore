const { expressjwt: jwt } = require("express-jwt");
require("dotenv").config();

const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ตรวจสอบว่า Authorization header มีรูปแบบที่ถูกต้องหรือไม่
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No valid token provided" });
  }

  // ดึง token จาก Authorization header
  const token = authHeader.split(" ")[1];

  // ตรวจสอบว่า token มีรูปแบบที่ถูกต้องก่อนส่งให้ express-jwt
  if (!token || token.split(".").length !== 3) { 
    return res.status(401).json({ message: "Unauthorized: Malformed token" });
  }

  // ใช้ express-jwt ตรวจสอบ token ถ้าอยู่ในรูปแบบที่ถูกต้อง
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth",
  })(req, res, next);
};

module.exports = jwtMiddleware;
