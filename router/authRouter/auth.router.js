const express = require("express");

const {createAdmin,loginAdmin,getAdmin} = require("../../controller/auth.controller");
const { isAuthenticated } = require("../../middleware/isAuthenticated");



const router = express.Router();

router.route("/login").post(loginAdmin);
router.route("/getAdmin").get(isAuthenticated,getAdmin);

router.route("/register").post(createAdmin);

router.route("/logout").post((req, res) => {
  // Handle logout logic here
  res.send("Logout route");
});

module.exports = router;
