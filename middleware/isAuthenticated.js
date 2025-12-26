const Admin = require("../model/admin.model");
const jwt = require("jsonwebtoken");


exports.isAuthenticated = async (req, res, next) => {
  try {
    const tokenHeader = process.env.TOKEN_NAME;
    const token = req.cookies[tokenHeader];
    if (!token) {
      return res.status(401).json({ message: "Not authenticated. No token." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    next();
  } catch (error) {
    res.status(500).json({ message: "Authentication error", error: error.message });
  }
};