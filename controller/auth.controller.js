const Admin = require("../model/admin.model");
const { sendToken } = require("../utils/jwtToken");

exports.createAdmin = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    if (password != confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const newAdmin = await Admin.create({ email, password });

    res
      .status(201)
      .json({ message: "Admin created successfully", data: newAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating admin", error: error.message });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    res.status(200).json({
      admin: admin,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting admin details", error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter the email!",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the password!",
      });
    }
    var admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin with this email does not exist" });
    }
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    admin = await Admin.findOne({ email }).select("-password");
    sendToken(admin, 200, "Admin logged in successfully", res, req);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in admin", error: error.message });
  }
};

exports.logoutAdmin = async (req, res) => {
  try {
    res.cookie(process.env.TOKEN_NAME, null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out admin", error: error.message });
  }
};
