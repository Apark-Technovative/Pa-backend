const express = require("express");

const {createAdmin,loginAdmin} = require("../../controller/auth.controller");



const router = express.Router();

router.route("/login").post(loginAdmin);

router.route("/register").post(createAdmin);

router.route("/logout").post((req, res) => {
  // Handle logout logic here
  res.send("Logout route");
});

module.exports = router;
