const Admin = require("../model/admin.model");
const { sendToken } = require("../utils/jwtToken");

exports.createAdmin = async (req, res) => {
  try {
    const { email, name, password, confirmPassword, role } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (!email || !name || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    if (adminExists) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    if (password != confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const newAdmin = await Admin.create({ email, password, name, role });

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
      message: "Admin detail retrived",
      data: admin,
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

exports.changeMyPassword = async (req, res) => {
  try {
    const id = req.admin.id;
    const admin = await Admin.findById(id).select("+password");
    console.log(admin);
    const { password, newPassword, confirmPassword } = req.body;
    if (admin.password) {
      if (!(await admin.comparePassword(password))) {
        return res.status(400).json({
          message: "Old Password is incorrect",
        });
      }
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    admin.password = newPassword;
    await admin.save();

    sendToken(admin, 200, "Your password have been changed", res, req);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).select("+password");
    const { newPassword, confirmPassword } = req.body;
    if (!admin) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }
    admin.password = newPassword;
    await admin.save();
    res.status(200).json({
      message: "Your password have been changed",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};
