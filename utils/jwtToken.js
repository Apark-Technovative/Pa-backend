const jwt = require("jsonwebtoken");

const sendToken = async (admin, statusCode, message, res, req) => {
  try {
    const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.Node_ENV === "PRODUCTION" ? true : false,
      sameSite: "Strict",
      maxAge: parseInt(process.env.JWT_EXPIRES_TIME),
    };

    res
      .status(statusCode)
      .cookie(process.env.TOKEN_NAME, accessToken, cookieOptions)
      .json({
        success: true,
        message: message,
        admin: {
          id: admin._id,
          email: admin.email,
          accessToken: accessToken,
        },
      });
  } catch (error) {
    
    res.status(500).json({
      message: "Error logging in admin",
      error: error.message,
    });
  }
};


module.exports = { sendToken };